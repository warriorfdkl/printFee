import { create } from 'zustand';

const load = () => {
  try {
    const raw = localStorage.getItem('pp_cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const persist = (items) => {
  try {
    localStorage.setItem('pp_cart', JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
};

const loadOrders = () => {
  try {
    const raw = localStorage.getItem('pp_orders');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const persistOrders = (orders) => {
  try {
    localStorage.setItem('pp_orders', JSON.stringify(orders));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
};

export const useCartStore = create((set, get) => ({
  items: load(),
  orders: loadOrders(),
  lastOrder: null,

  addItem: (item) => {
    let saved = true;
    set((state) => {
      const items = [...state.items, { ...item, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, qty: item.qty || 1 }];
      saved = persist(items);
      return { items };
    });
    return saved;
  },

  removeItem: (id) =>
    set((state) => {
      const items = state.items.filter((i) => i.id !== id);
      persist(items);
      return { items };
    }),

  setQty: (id, qty) =>
    set((state) => {
      const items = state.items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
      persist(items);
      return { items };
    }),

  clear: () => {
    persist([]);
    set({ items: [] });
  },

  placeOrder: (customer) => {
    const items = get().items;
    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const order = {
      number: Math.floor(100000 + Math.random() * 900000),
      items,
      total,
      customer,
      date: new Date().toISOString(),
    };
    persist([]);
    const orders = [order, ...get().orders];
    persistOrders(orders);
    set({ items: [], lastOrder: order, orders });
    return order;
  },
}));

export const cartTotal = (items) => items.reduce((sum, i) => sum + i.price * i.qty, 0);
export const cartCount = (items) => items.reduce((sum, i) => sum + i.qty, 0);
