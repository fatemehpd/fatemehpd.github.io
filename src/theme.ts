/**
 * Light / dark theme.
 *
 * The resolved theme lives on <html data-theme="light|dark">. An inline
 * script in index.html sets it before first paint (no flash). The site opens
 * in dark mode; if a visitor switches to light with the toggle, that choice
 * is remembered in their browser.
 */

export type Theme = 'light' | 'dark';

const KEY = 'fp-theme';
const THEME_COLOR: Record<Theme, string> = { light: '#f0f4f7', dark: '#0a0b12' };

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function apply(theme: Theme) {
  const root = document.documentElement;
  if (root.dataset.theme === theme) return;
  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
  window.dispatchEvent(new CustomEvent<Theme>('themechange', { detail: theme }));
}

export function toggleTheme() {
  const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* private mode: still switches for this visit */
  }
  apply(next);
}

export function onThemeChange(fn: (t: Theme) => void) {
  const handler = (e: Event) => fn((e as CustomEvent<Theme>).detail);
  window.addEventListener('themechange', handler);
  return () => window.removeEventListener('themechange', handler);
}
