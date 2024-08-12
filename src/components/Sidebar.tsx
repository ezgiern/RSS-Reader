"use client";
import React, { useState } from "react";
import { addRssSource } from "../utils/db";
import { FiMenu } from "react-icons/fi";

interface SidebarProps {
  onAddSource: (newSource: { name: string; url: string }) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddSource }) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [isOpen, setIsOpen] = useState(true); // Sidebar'ın açık/kapalı durumu

  const handleAddSource = async () => {
    if (name && url) {
      const newSource = { name, url };
      await addRssSource({ name, url });
      onAddSource(newSource);
      setName("");
      setUrl("");
    } else {
      alert("Lütfen tüm alanları doldurun.");
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed z-50 p-1 bg-blue-500 text-white rounded-full"
      >
        <FiMenu size={24} />
      </button>
      <div
        className={`fixed top-0 left-0 h-full bg-gray-200 shadow-lg p-4 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "320px" }} // Sidebar'ın genişliği
      >
        <h2 className="text-4xl font-semibold text-blue-600/100 dark:text-blue-500/100 mb-4 mt-32 text-center drop-shadow-md">
          RSS Reader
        </h2>
        <input
          type="text"
          placeholder="Ad"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-3/4 mb-3 p-2 ml-8 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-3/4 mb-3 p-2 ml-8 border border-gray-300 rounded"
        />

        <div className="ml-5">
          <button
            onClick={handleAddSource}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-10 ml-14 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Kaynak Ekle
            </span>
          </button>
        </div>
      </div>
      <div
        className={`transition-all duration-300 ${isOpen ? "ml-80" : "ml-0"}`} // Sidebar genişliğine göre margin-left ayarlanır
      >
        {/* Diğer içerikler bu div içinde olacak */}
      </div>
    </>
  );
};

export default Sidebar;
