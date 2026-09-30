import Storage from 'expo-sqlite/kv-store';

/**
 * Small preferences kept on the device (language, theme). Synchronous reads,
 * so the first render already knows them. Not for secrets: the session lives
 * in SecureStore (lib/auth-client.ts).
 */
export const preferences = {
  get(key: PreferenceKey): string | null {
    try {
      return Storage.getItemSync(key);
    } catch {
      return null;
    }
  },
  set(key: PreferenceKey, value: string): void {
    Storage.setItemSync(key, value);
  },
};

export type PreferenceKey = 'locale' | 'directionReload';
