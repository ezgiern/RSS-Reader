import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'Geçersiz URL' });
    return;
  }

  try {
    const response = await fetch(url);
    const text = await response.text();
    res.status(200).json({ rssData: text });
  } catch (error) {
    res.status(500).json({ error: 'RSS feed alınamadı' });
  }
}
