import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import TShirt from '../components/TShirt';
import { PRODUCTS, CATEGORIES, GARMENT_COLORS, colorHex } from '../data/products';
import './Catalog.css';

export default function Catalog() {
  const [category, setCategory] = useState('Все');
  const [color, setColor] = useState(null);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const byCategory = category === 'Все' || p.category === category;
      const byColor = !color || p.colors.includes(color);
      return byCategory && byColor;
    });
  }, [category, color]);

  return (
    <div className="page catalog">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Каталог</span>
          <h1 className="catalog__title">Выбери футболку под свой принт</h1>
        </Reveal>

        <Reveal delay={0.1} className="catalog__filters">
          <div className="catalog__cats">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`catalog__chip ${category === c ? 'is-active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="catalog__colors">
            <button
              className={`catalog__swatch catalog__swatch--all ${!color ? 'is-active' : ''}`}
              onClick={() => setColor(null)}
              aria-label="Все цвета"
            >
              Все
            </button>
            {GARMENT_COLORS.map((c) => (
              <button
                key={c.id}
                className={`catalog__swatch ${color === c.id ? 'is-active' : ''}`}
                style={{ background: c.hex }}
                onClick={() => setColor(c.id === color ? null : c.id)}
                aria-label={c.name}
                title={c.name}
              />
            ))}
          </div>
        </Reveal>

        <div className="catalog__grid">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.06}>
              <Link to={`/constructor/${p.id}`} className="product-card">
                <div className="product-card__visual">
                  <TShirt color={colorHex(color && p.colors.includes(color) ? color : p.colors[0])} outline="#151515" />
                  {p.tag && <span className="product-card__tag">{p.tag}</span>}
                </div>
                <div className="product-card__info">
                  <h3>{p.name}</h3>
                  <p>{p.blurb}</p>
                  <span className="product-card__price">{p.price.toLocaleString('ru-RU')} ₽</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="catalog__empty">Ничего не нашлось — попробуй другой фильтр.</p>
        )}
      </div>
    </div>
  );
}
