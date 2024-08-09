import React, { useEffect, useState } from "react";
import { fetchRssFeed } from "../utils/rssParser";
import { FiRefreshCcw, FiTrash } from "react-icons/fi";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from "./Arrows";

interface RssColumnProps {
  name: string;
  url: string;
  onDeleteSource: (url: string) => void;
}

const RssColumn: React.FC<RssColumnProps> = ({ name, url, onDeleteSource }) => {
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]); // Galeri için

  useEffect(() => {
    const fetchFeed = async () => {
      const feedData = await fetchRssFeed(url);
      if (feedData) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(feedData.rssData, "text/xml");
        const items = Array.from(xmlDoc.getElementsByTagName("item")).map(
          (item) => {
            const mediaContents = Array.from(
              item.getElementsByTagName("media:content")
            ).map((media) => media.getAttribute("url"));
            const enclosures = Array.from(
              item.getElementsByTagName("enclosure")
            ).map((enclosure) => enclosure.getAttribute("url"));
            const imageUrls = [...mediaContents, ...enclosures].filter(
              (url) => url
            );

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
              imageUrls: imageUrls as string[], // Tüm resimleri burada topluyoruz
            };
          }
        );

        setFeedItems(items);

        // Galeri için sadece ilk resimleri al
        const gallery = items
          .map((item) => item.imageUrls[0]) // İlk resim
          .filter((url) => url); // Geçerli URL'leri al

        setGalleryImages(gallery);
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
          const mediaContents = Array.from(
            item.getElementsByTagName("media:content")
          ).map((media) => media.getAttribute("url"));
          const enclosures = Array.from(
            item.getElementsByTagName("enclosure")
          ).map((enclosure) => enclosure.getAttribute("url"));
          const imageUrls = [...mediaContents, ...enclosures].filter(
            (url) => url
          );

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
            imageUrls: imageUrls as string[], // Tüm resimleri burada topluyoruz
          };
        }
      );

      setFeedItems(items);

      // Galeri için sadece ilk resimleri al
      const gallery = items
        .map((item) => item.imageUrls[0]) // İlk resim
        .filter((url) => url); // Geçerli URL'leri al

      setGalleryImages(gallery);
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="relative flex flex-col bg-white shadow-lg p-4 m-2 w-80 h-full overflow-auto">
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
      {/* Galeri */}
      {galleryImages.length > 0 && (
        <Slider {...settings} className="mb-6">
          {galleryImages.map((imageUrl, index) => (
            <div key={index}>
              <img
                src={imageUrl}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </Slider>
      )}
      {feedItems.length > 0 ? (
        feedItems.map((item, index) => (
          <div key={index} className="mb-4 border-b pb-4">
            {item.imageUrls.length > 0 && (
              <Slider>
                {item.imageUrls.map((imageUrl: string, imgIndex: number) => (
                  <div key={imgIndex}>
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className="mb-2 w-full h-auto object-cover"
                    />
                  </div>
                ))}
              </Slider>
            )}
            <h3 className="font-semibold text-lg mt-2">{item.title}</h3>
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
