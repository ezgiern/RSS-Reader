// second worker
onmessage = async (event: MessageEvent<{ url: string }>) => {
    const { url } = event.data;
  
    try {
      const response = await fetch(url);
      const rssData = await response.text();
      postMessage({ url, rssData });
    } catch (error: any) {
      postMessage({ url, error: error.message });
    }
  };