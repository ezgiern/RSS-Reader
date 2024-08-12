export const fetchRssFeed = async (url: string) => {
  try {
    const response = await fetch(`/api/rssProxy?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    // html içeriklerini işleyebilmek için trustedhtml
    if (window.trustedTypes && data.htmlContent) {
      const policy = window.trustedTypes.createPolicy('default', {
        createHTML: (input: string) => input,
      });
      data.htmlContent = policy.createHTML(data.htmlContent) as unknown as string;
    }

    return data;
  } catch (error) {
    console.error('RSS feed çekilirken hata:', error);
    return null;
  }
};








  