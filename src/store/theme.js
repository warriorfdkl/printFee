import { create } from 'zustand';

const KEY = 'pp_theme';

const load = () => {
  try {
    return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

const persist = (theme) => {
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* ignore quota / privacy-mode errors */
  }
};

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
};

const initial = load();
applyTheme(initial);

export const useThemeStore = create((set, get) => ({
  theme: initial,

  setTheme: (theme) => {
    persist(theme);
    applyTheme(theme);
    set({ theme });
  },

  toggleTheme: () => {
    get().setTheme(get().theme === 'dark' ? 'light' : 'dark');
  },
}));
