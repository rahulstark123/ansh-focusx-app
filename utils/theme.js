import { storageGetItem, storageSetItem } from './storage';

export const THEME_KEY = 'fx_theme_preference';
export const THEME_DARK = 'dark';
export const THEME_LIGHT = 'light';

const listeners = new Set();

const palettes = {
  [THEME_DARK]: {
    id: THEME_DARK,
    background: '#000000',
    surface: '#111111',
    surfaceAlt: '#161616',
    border: '#1F1F1F',
    text: '#FFFFFF',
    textMuted: '#9D9D9D',
    textHint: '#6D6D6D',
    radioInactive: '#6F6F6F',
  },
  [THEME_LIGHT]: {
    id: THEME_LIGHT,
    background: '#F5F5F5',
    surface: '#FFFFFF',
    surfaceAlt: '#F1F1F1',
    border: '#D7D7D7',
    text: '#111111',
    textMuted: '#4E4E4E',
    textHint: '#666666',
    radioInactive: '#8A8A8A',
  },
};

let activeTheme = THEME_DARK;

export function getThemePalette(themeId) {
  return palettes[themeId] || palettes[THEME_DARK];
}

export async function loadThemePreference() {
  const saved = await storageGetItem(THEME_KEY);
  if (saved === THEME_DARK || saved === THEME_LIGHT) {
    activeTheme = saved;
  }
  return activeTheme;
}

export async function setThemePreference(themeId) {
  const nextTheme = themeId === THEME_LIGHT ? THEME_LIGHT : THEME_DARK;
  activeTheme = nextTheme;
  await storageSetItem(THEME_KEY, nextTheme);
  for (const listener of listeners) {
    listener(nextTheme);
  }
  return nextTheme;
}

export function subscribeTheme(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
