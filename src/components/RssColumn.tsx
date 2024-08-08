import React, { useEffect, useState } from "react";
import { fetchRssFeed } from "../utils/rssParser";
import { FiRefreshCcw, FiTrash } from "react-icons/fi";

interface RssColumnProps {
  name: string;
  url: string;
  onDeleteSource: (url: string) => void;
}

const RssColumn: React.FC<RssColumnProps> = ({ name, url, onDeleteSource }) => {
  const [feedItems, setFeedItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeed = async () => {
      const feedData = await fetchRssFeed(url);
      if (feedData) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(feedData.rssData, "text/xml");
        const items = Array.from(xmlDoc.getElementsByTagName("item")).map(
          (item) => {
            const mediaContent = item
              .getElementsByTagName("media:content")[0]
              ?.getAttribute("url");
            const enclosure = item
              .getElementsByTagName("enclosure")[0]
              ?.getAttribute("url");
            const imageUrl = mediaContent || enclosure || null;

            return {
              title:
                item.getElementsByTagName("title")[0]?.textContent ||
                "Başlık Yok",
              description:
                item.getElementsByTagName("description")[0]?.textContent ||
                "Açıklama Yok",
              pubDate:
                item.getElementsByTagName("pubDate")[0]?.textContent ||
                "Tarih Yok",
              link: item.getElementsByTagName("link")[0]?.textContent || "#",
              author:
                item.getElementsByTagName("author")[0]?.textContent ||
                "Bilinmiyor",
              imageUrl: imageUrl,
            };
          }
        );
        setFeedItems(items);
      }
    };
    fetchFeed();
  }, [url]);

  const handleRefresh = async () => {
    const feedData = await fetchRssFeed(url);
    if (feedData) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(feedData.rssData, "text/xml");
      const items = Array.from(xmlDoc.getElementsByTagName("item")).map(
        (item) => {
          const mediaContent = item
            .getElementsByTagName("media:content")[0]
            ?.getAttribute("url");
          const enclosure = item
            .getElementsByTagName("enclosure")[0]
            ?.getAttribute("url");
          const imageUrl = mediaContent || enclosure || null;

          return {
            title:
              item.getElementsByTagName("title")[0]?.textContent ||
              "Başlık Yok",
            description:
              item.getElementsByTagName("description")[0]?.textContent ||
              "Açıklama Yok",
            pubDate:
              item.getElementsByTagName("pubDate")[0]?.textContent ||
              "Tarih Yok",
            link: item.getElementsByTagName("link")[0]?.textContent || "#",
            author:
              item.getElementsByTagName("author")[0]?.textContent ||
              "Bilinmiyor",
            imageUrl: imageUrl,
          };
        }
      );
      setFeedItems(items);
    }
  };

  return (
    <div className="flex flex-col bg-white shadow-lg p-4 m-2 w-80">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-xl">{name}</h2>
        <div className="flex space-x-2">
          <FiRefreshCcw
            onClick={handleRefresh}
            className="text-blue-500 cursor-pointer"
            size={24}
          />
          <FiTrash
            onClick={() => onDeleteSource(url)}
            className="text-red-500 cursor-pointer"
            size={24}
          />
        </div>
      </div>
      {feedItems.length > 0 ? (
        feedItems.map((item, index) => (
          <div key={index} className="mb-4">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="mb-2 w-full h-auto object-cover"
              />
            )}
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-sm">{item.description}</p>
            <p className="text-xs text-gray-600">{item.pubDate}</p>
            <a
              href={item.link}
              className="text-blue-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              Haberi Oku
            </a>
          </div>
        ))
      ) : (
        <p>Veri yok veya yükleniyor...</p>
      )}
    </div>
  );
};

export default RssColumn;
