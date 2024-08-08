export const fetchRssFeed = async (url: string) => {
    try {
      const response = await fetch(`/api/rssProxy?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('RSS feed çekilirken hata:', error);
      return null;
    }
  };
  