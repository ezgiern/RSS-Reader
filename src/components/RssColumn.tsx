import React, { useEffect, useState } from "react";
import { fetchRssFeed } from "../utils/rssParser";
import { FiRefreshCcw, FiTrash } from "react-icons/fi";
import Slider from "react-slick";
import Modal from "react-modal";
import { NextArrow, PrevArrow } from "./Arrows";

interface RssColumnProps {
  name: string;
  url: string;
  onDeleteSource: (url: string) => void;
}

const RssColumn: React.FC<RssColumnProps> = ({ name, url, onDeleteSource }) => {
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]); // Galeri için
  const [isOpen, setIsOpen] = useState(false); // Modal açma/kapatma durumu

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
          .flatMap((item) => item.imageUrls) // Tüm resimler
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
        .flatMap((item) => item.imageUrls) // Tüm resimler
        .filter((url) => url); // Geçerli URL'leri al

      setGalleryImages(gallery);
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
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
      <div onClick={openModal}>
        {galleryImages.length > 0 && (
          <img
            src={galleryImages[0]} // İlk resmi gösteriyoruz
            alt="Gallery Thumbnail"
            className="w-full h-auto object-cover cursor-pointer"
          />
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Image Carousel"
        className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center"
        overlayClassName="fixed inset-0 z-40"
      >
        <div className="w-full h-full max-w-5xl p-4 bg-white rounded-lg">
          <Slider {...settings}>
            {galleryImages.map((imageUrl, index) => (
              <div
                key={index}
                className="flex justify-center items-center h-full"
              >
                <img
                  src={imageUrl}
                  alt={`Gallery image ${index + 1}`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </Slider>
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white text-2xl"
          >
            X
          </button>
        </div>
      </Modal>

      {feedItems.length > 0 ? (
        feedItems.map((item, index) => (
          <div key={index} className="mb-4 border-b pb-4">
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
