"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import RssColumn from "../components/RssColumn";
import { getAllRssSources, deleteRssSource } from "../utils/db";

const Home: React.FC = () => {
  const [sources, setSources] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    const fetchSources = async () => {
      const allSources = await getAllRssSources();
      setSources(allSources);
    };
    fetchSources();
  }, []);

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
      }, 300000); // 5 dakikada bir çalışır
    };

    if (sources.length > 0) {
      startWorkers();
    }
  }, [sources]);

  const handleAddSource = (newSource: { name: string; url: string }) => {
    setSources((prevSources) => [...prevSources, newSource]);
  };

  const handleDeleteSource = async (url: string) => {
    await deleteRssSource(url);
    setSources((prevSources) =>
      prevSources.filter((source) => source.url !== url)
    );
  };

  return (
    <div className="flex">
      <Sidebar onAddSource={handleAddSource} />
      <div className="flex flex-nowrap">
        {sources.map((source, index) => (
          <RssColumn
            key={index}
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
