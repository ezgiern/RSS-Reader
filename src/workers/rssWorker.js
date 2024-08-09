// rssWorker.js
onmessage = async function (event) {
    const { url } = event.data;
    
    try {
      const response = await fetch(url);
      const rssData = await response.text();
      postMessage({ url, rssData });
    } catch (error) {
      postMessage({ url, error: error.message });
    }
  };
  
