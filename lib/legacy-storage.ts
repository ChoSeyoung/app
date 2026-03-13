import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export async function readLegacyStorageItem(key: string): Promise<string | null> {
  try {
    const asyncStorageValue = await AsyncStorage.getItem(key);
    if (asyncStorageValue !== null) {
      return asyncStorageValue;
    }
  } catch {
    // Ignore and continue fallback chain.
  }

  try {
    const secureStoreValue = await SecureStore.getItemAsync(key);
    if (secureStoreValue !== null) {
      return secureStoreValue;
    }
  } catch {
    // Ignore and return null below.
  }

  return null;
}
