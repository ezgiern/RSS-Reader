"use client";
import React, { useState } from "react";
import { addRssSource } from "../utils/db";

interface SidebarProps {
  onAddSource: (newSource: { name: string; url: string }) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddSource }) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const handleAddSource = async () => {
    if (name && url) {
      const newSource = { name, url };
      await addRssSource(name, url);
      onAddSource(newSource);
      setName("");
      setUrl("");
    } else {
      alert("Lütfen tüm alanları doldurun.");
    }
  };

  return (
    <div className="flex-none w-80 bg-gray-200 p-4 ">
      <h2 className="text-lg font-bold mb-4">RSS Kaynağı Ekle</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-2 p-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full mb-2 p-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleAddSource}
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Kaynağı Ekle
      </button>
    </div>
  );
};

export default Sidebar;
