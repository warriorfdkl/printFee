# PrintFee — печать на футболках на заказ

Сайт-магазин с конструктором принта: каталог, конструктор (загрузка своей картинки/текста на футболку с превью), корзина и оформление заказа (без реального списания денег — заявка уходит менеджеру).

## Стек

- React + Vite
- React Router
- Framer Motion (анимации, скролл-эффекты)
- Zustand (корзина, сохраняется в localStorage)

## Запуск

```bash
npm install
npm run dev
```

Сборка для продакшена:

```bash
npm run build
```

## Структура

- `src/pages` — страницы (Home, Catalog, Constructor, Cart, Checkout, About, Contacts)
- `src/components` — переиспользуемые компоненты (Header, Footer, TShirt, Reveal, Marquee)
- `src/store/cart.js` — стор корзины
- `src/data/products.js` — каталог товаров, цвета, размеры (плейсхолдеры)
- `src/assets/logo` — логотип PrintFee (белый/чёрный/ч-б варианты)

Мокапы футболок нарисованы SVG-контуром (без фото) — при появлении реальных фото товаров их можно подставить в `TShirt.jsx` или карточки каталога.
