import { create } from 'zustand';

const load = () => {
  try {
    const raw = localStorage.getItem('pp_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const persist = (user) => {
  try {
    if (user) localStorage.setItem('pp_user', JSON.stringify(user));
    else localStorage.removeItem('pp_user');
  } catch {
    /* ignore quota / privacy-mode errors */
  }
};

export const useAuthStore = create((set) => ({
  user: load(),

  login: (user) => {
    persist(user);
    set({ user });
  },

  logout: () => {
    persist(null);
    set({ user: null });
  },
}));
