import { openDB } from 'idb';

const DB_NAME = 'rssReaderDB';
const STORE_NAME = 'rssSources';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const addRssSource = async (name: string, url: string) => {
  const db = await initDB();
  await db.add(STORE_NAME, { name, url });
};

export const deleteRssSource = async (url: string) => {
  const db = await initDB();
  await db.delete(STORE_NAME, url);
};


export const getAllRssSources = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};
