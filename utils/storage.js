import AsyncStorage from '@react-native-async-storage/async-storage';

const memoryStore = new Map();

async function withFallback(action, fallback) {
  try {
    return await action();
  } catch (_error) {
    return fallback();
  }
}

export async function storageGetItem(key) {
  return withFallback(() => AsyncStorage.getItem(key), () => memoryStore.get(key) ?? null);
}

export async function storageSetItem(key, value) {
  return withFallback(
    () => AsyncStorage.setItem(key, value),
    () => {
      memoryStore.set(key, value);
    }
  );
}

export async function storageMultiRemove(keys) {
  return withFallback(
    () => AsyncStorage.multiRemove(keys),
    () => {
      for (const key of keys) {
        memoryStore.delete(key);
      }
    }
  );
}
