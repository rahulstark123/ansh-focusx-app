import Constants from 'expo-constants';

const hostFromExpo = Constants.expoConfig?.hostUri?.split(':')?.[0];
const inferredBase = hostFromExpo ? `http://${hostFromExpo}:4000` : 'http://localhost:4000';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || inferredBase;

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}
