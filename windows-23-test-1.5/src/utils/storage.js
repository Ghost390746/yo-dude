import localforage from "localforage";

export const saveItem = async (key, value) => {
  await localforage.setItem(key, value);
};

export const getItem = async (key) => {
  return await localforage.getItem(key);
};

export const removeItem = async (key) => {
  await localforage.removeItem(key);
};
