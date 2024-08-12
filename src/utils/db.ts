import { openDB } from 'idb';
import { url } from 'inspector';

const DB_NAME = 'rssReaderDB';
const STORE_NAME = 'rssSources';


// Veri tabanını açan fonksiyon (tanımlı değilse upgrade ile oluşturur ya da günceller)
export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const addRssSource = async (source: { name: string; url: string }) => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    },
  });
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  const id = (await store.add(source)) as number; // ID'yi number olarak cast ediyoruz
  await tx.done;
  return id;
};

export const deleteRssSource = async (id: number) => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};

export const getAllRssSources = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};






