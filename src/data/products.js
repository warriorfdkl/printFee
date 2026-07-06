export const GARMENT_COLORS = [
  { id: 'white', name: 'Белый', hex: '#f7f6f2' },
  { id: 'black', name: 'Чёрный', hex: '#161616' },
  { id: 'sand', name: 'Песочный', hex: '#d8cdb8' },
  { id: 'grey', name: 'Серый меланж', hex: '#9a9a96' },
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const CATEGORIES = ['Все', 'Оверсайз', 'Классика', 'Крой унисекс', 'Лимитки'];

export const PRODUCTS = [
  {
    id: 'p1',
    name: 'BASE 01',
    category: 'Классика',
    price: 1990,
    blurb: 'Плотный хлопок 220г, прямой крой',
    colors: ['white', 'black', 'sand'],
    tag: 'Бестселлер',
  },
  {
    id: 'p2',
    name: 'OVERSIZE FIT',
    category: 'Оверсайз',
    price: 2390,
    blurb: 'Свободный силуэт, заниженная линия плеча',
    colors: ['black', 'grey', 'sand'],
    tag: 'Новинка',
  },
  {
    id: 'p3',
    name: 'UNISEX HEAVY',
    category: 'Крой унисекс',
    price: 2190,
    blurb: 'Плотность 240г, двойной шов',
    colors: ['white', 'black'],
  },
  {
    id: 'p4',
    name: 'DROP 004',
    category: 'Лимитки',
    price: 2890,
    blurb: 'Ограниченная партия, 40 штук',
    colors: ['black', 'sand'],
    tag: 'Лимит',
  },
  {
    id: 'p5',
    name: 'BASE 02',
    category: 'Классика',
    price: 1990,
    blurb: 'Плотный хлопок 220г, прямой крой',
    colors: ['white', 'grey', 'black'],
  },
  {
    id: 'p6',
    name: 'STREET LOOSE',
    category: 'Оверсайз',
    price: 2490,
    blurb: 'Удлинённый низ, широкий рукав',
    colors: ['black', 'white'],
  },
  {
    id: 'p7',
    name: 'UNISEX LIGHT',
    category: 'Крой унисекс',
    price: 1890,
    blurb: 'Лёгкий хлопок 180г, дышащая ткань',
    colors: ['white', 'sand', 'grey'],
  },
  {
    id: 'p8',
    name: 'DROP 005',
    category: 'Лимитки',
    price: 2990,
    blurb: 'Ограниченная партия, 25 штук',
    colors: ['black'],
    tag: 'Лимит',
  },
];

export const colorHex = (id) => GARMENT_COLORS.find((c) => c.id === id)?.hex || '#fff';
export const colorName = (id) => GARMENT_COLORS.find((c) => c.id === id)?.name || id;

export const FONTS = [
  { id: 'display', label: 'Крупный', family: 'var(--font-display)' },
  { id: 'body', label: 'Простой', family: 'var(--font-body)' },
  { id: 'serif', label: 'Элегантный', family: "'Playfair Display', serif" },
  { id: 'script', label: 'Рукописный', family: "'Caveat', cursive" },
  { id: 'condensed', label: 'Афиша', family: "'Oswald', sans-serif" },
  { id: 'rounded', label: 'Круглый', family: "'Comfortaa', sans-serif" },
];

export const fontFamilyFor = (id) => FONTS.find((f) => f.id === id)?.family || 'inherit';
