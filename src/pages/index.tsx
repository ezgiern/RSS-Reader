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
