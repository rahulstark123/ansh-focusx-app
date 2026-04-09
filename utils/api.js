const rawBase = process.env.EXPO_PUBLIC_API_URL || 'https://ansh-focusx-api.vercel.app';
export const API_BASE_URL = rawBase.replace(/\/+$/, '');

export async function apiFetch(path, options = {}) {
  const { timeoutMs = 12000, ...requestOptions } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(requestOptions.headers || {}) },
      signal: controller.signal,
      ...requestOptions,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    let details = '';
    try {
      details = await response.text();
    } catch (_error) {
      details = '';
    }
    throw new Error(`API request failed: ${response.status}${details ? ` - ${details}` : ''}`);
  }

  return response.json();
}
