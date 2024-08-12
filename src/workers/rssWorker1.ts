// first worker + onmessage worker'a bir mesaj gönderildiğinde tetiklenir
onmessage = async (event: MessageEvent<{ url: string }>) => {
    const { url } = event.data;


  // worker url alıp rss kaynağını getiriyor
    try {
      const response = await fetch(url);
      const rssData = await response.text();
      postMessage({ url, rssData });
    } catch (error: any) {
      postMessage({ url, error: error.message });
    }
  };
  
  