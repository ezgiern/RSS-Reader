"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import RssColumn from "../components/RssColumn";
import { getAllRssSources, deleteRssSource, addRssSource } from "../utils/db";

const Home: React.FC = () => {
  const [sources, setSources] = useState<
    { id: number; name: string; url: string }[]
  >([]);

  // RSS kaynaklarından veri çekiyoruz
  useEffect(() => {
    const fetchSources = async () => {
      const allSources = await getAllRssSources();
      setSources(allSources);
    };
    fetchSources();
  }, []);

  // Kaynakları aldıktan sonra workerları başlatıyoruz + kaynaklar değiştiyse günceller
  useEffect(() => {
    const startWorkers = () => {
      const worker1 = new Worker(
        new URL("../workers/rssWorker1.ts", import.meta.url)
      );
      const worker2 = new Worker(
        new URL("../workers/rssWorker2.ts", import.meta.url)
      );

      const handleWorkerMessage = (
        event: MessageEvent<{ url: string; rssData?: string; error?: string }>
      ) => {
        const { url, rssData, error } = event.data;
        if (error) {
          console.error(`Error fetching RSS feed from ${url}: ${error}`);
        } else {
          console.log(`RSS feed from ${url}:`, rssData);
        }
      };

      worker1.onmessage = handleWorkerMessage;
      worker2.onmessage = handleWorkerMessage;

      // Bu fonksiyonla 5 dakikada bir workerlara kaynak gönderiyoruz
      setInterval(() => {
        const half = Math.ceil(sources.length / 2);

        // Worker1 için kaynak atama
        const sourcesForWorker1 = sources.slice(0, half);
        sourcesForWorker1.forEach((source) =>
          worker1.postMessage({ url: source.url })
        );

        // Worker2 için kalan kaynakları atama
        const sourcesForWorker2 = sources.slice(half);
        sourcesForWorker2.forEach((source) =>
          worker2.postMessage({ url: source.url })
        );
      }, 300000); // 5 dakikada bir çalışır + 300000ms=5dk
    };

    if (sources.length > 0) {
      startWorkers();
    }
  }, [sources]);

  const handleAddSource = async (newSource: { name: string; url: string }) => {
    const id = await addRssSource(newSource); // Yeni kaynağı ekle ve id'sini al
    setSources((prevSources) => [
      ...prevSources,
      { ...newSource, id: id as number },
    ]);
  };

  const handleDeleteSource = async (id: number) => {
    await deleteRssSource(id);
    setSources((prevSources) =>
      prevSources.filter((source) => source.id !== id)
    );
  };

  return (
    <div className="flex">
      <Sidebar onAddSource={handleAddSource} />
      <div className="flex flex-nowrap bg-gray-200 shadow-lg">
        {sources.map((source, index) => (
          <RssColumn
            key={source.id} // Her source için unique id kullanıyoruz
            id={source.id} // id'yi burada pass ediyoruz
            name={source.name}
            url={source.url}
            onDeleteSource={handleDeleteSource}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
