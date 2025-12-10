// IndexedDB 封装工具，用于管理应用程序数据的存储和读取

const DB_NAME = 'SunoCoverArrangerDB';
const DB_VERSION = 1;
const STORE_NAME = 'settings';

// 打开数据库连接
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    // 数据库升级时创建对象存储
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });

        // 创建索引以提高查询效率
        objectStore.createIndex('key', 'key', { unique: true });
      }
    };
  });
};

// 存储数据到IndexedDB
const storeData = async (
  key: string,
  value: any,
): Promise<{ success: boolean; error?: any }> => {
  try {
    const db = await openDB();

    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      const keyIndex = objectStore.index('key');

      // 首先检查是否已存在该键
      const getRequest = keyIndex.get(key);

      getRequest.onsuccess = () => {
        const existingData = getRequest.result;

        if (existingData) {
          // 如果存在则更新数据
          const updateRequest = objectStore.put({
            ...existingData,
            value,
            updatedAt: new Date().toISOString(),
          });

          updateRequest.onsuccess = () => resolve({ success: true });
          updateRequest.onerror = () =>
            resolve({ success: false, error: updateRequest.error });
        } else {
          // 如果不存在则添加新数据
          const addRequest = objectStore.add({
            key,
            value,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

          addRequest.onsuccess = () => resolve({ success: true });
          addRequest.onerror = () =>
            resolve({ success: false, error: addRequest.error });
        }
      };

      getRequest.onerror = () =>
        resolve({ success: false, error: getRequest.error });
    });
  } catch (error) {
    return { success: false, error };
  }
};

// 从IndexedDB读取数据
const getData = async (
  key: string,
): Promise<{ success: boolean; data?: any; error?: any }> => {
  try {
    const db = await openDB();

    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);
      const keyIndex = objectStore.index('key');

      const request = keyIndex.get(key);

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          resolve({ success: true, data: result.value });
        } else {
          resolve({ success: true, data: null }); // 没有找到数据，返回null而不是失败
        }
      };

      request.onerror = () => resolve({ success: false, error: request.error });
    });
  } catch (error) {
    return { success: false, error };
  }
};

// 从IndexedDB删除数据
const deleteData = async (
  key: string,
): Promise<{ success: boolean; error?: any }> => {
  try {
    const db = await openDB();

    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      const keyIndex = objectStore.index('key');

      // 首先查找数据的ID
      const getRequest = keyIndex.get(key);

      getRequest.onsuccess = () => {
        const result = getRequest.result;
        if (result) {
          // 如果找到数据则删除
          const deleteRequest = objectStore.delete(result.id);

          deleteRequest.onsuccess = () => resolve({ success: true });
          deleteRequest.onerror = () =>
            resolve({ success: false, error: deleteRequest.error });
        } else {
          // 如果没有找到数据，仍然返回成功（因为已经是删除状态）
          resolve({ success: true });
        }
      };

      getRequest.onerror = () =>
        resolve({ success: false, error: getRequest.error });
    });
  } catch (error) {
    return { success: false, error };
  }
};

// API Key 相关的存储键名
const API_KEY_STORAGE_KEY = 'deepseekApiKey';

// 存储 API Key 到 IndexedDB
const saveApiKeyToIndexedDB = async (
  apiKey: string,
): Promise<{ success: boolean; error?: any }> => {
  return await storeData(API_KEY_STORAGE_KEY, apiKey);
};

// 从 IndexedDB 读取 API Key
const getApiKeyFromIndexedDB = async (): Promise<{
  success: boolean;
  apiKey?: string;
  error?: any;
}> => {
  const result = await getData(API_KEY_STORAGE_KEY);
  if (result.success) {
    return { success: true, apiKey: result.data || '' };
  } else {
    return { success: false, error: result.error };
  }
};

// 从 IndexedDB 删除 API Key
const deleteApiKeyFromIndexedDB = async (): Promise<{
  success: boolean;
  error?: any;
}> => {
  return await deleteData(API_KEY_STORAGE_KEY);
};

export {
  storeData,
  getData,
  deleteData,
  saveApiKeyToIndexedDB,
  getApiKeyFromIndexedDB,
  deleteApiKeyFromIndexedDB,
};
