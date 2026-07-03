import { useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Reveal from '../components/Reveal';
import TShirt, { PRINT_ZONE } from '../components/TShirt';
import { PRODUCTS, GARMENT_COLORS, SIZES, colorHex } from '../data/products';
import { useCartStore } from '../store/cart';
import './Constructor.css';

const FONTS = [
  { id: 'display', label: 'Крупный' },
  { id: 'body', label: 'Простой' },
];

const PRINT_SURCHARGE = { image: 400, text: 250 };

export default function Constructor() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  const baseProduct = useMemo(
    () => PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0],
    [productId]
  );

  const [color, setColor] = useState(baseProduct.colors[0]);
  const [size, setSize] = useState('M');
  const [mode, setMode] = useState('image');
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [font, setFont] = useState('display');
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [added, setAdded] = useState(false);

  const dragState = useRef(null);

  const hasPrint = (mode === 'image' && image) || (mode === 'text' && text.trim());
  const price = baseProduct.price + (hasPrint ? PRINT_SURCHARGE[mode] : 0);

  const onUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setTransform({ x: 0, y: 0, scale: 1 });
    };
    reader.readAsDataURL(file);
  };

  const onPointerDown = (e) => {
    if (!hasPrint) return;
    dragState.current = { startX: e.clientX, startY: e.clientY, origin: { ...transform } };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    const bound = 60;
    setTransform((t) => ({
      ...t,
      x: Math.max(-bound, Math.min(bound, dragState.current.origin.x + dx)),
      y: Math.max(-bound, Math.min(bound, dragState.current.origin.y + dy)),
    }));
  };

  const onPointerUp = () => {
    dragState.current = null;
  };

  const handleAddToCart = () => {
    addItem({
      productId: baseProduct.id,
      name: baseProduct.name,
      color,
      size,
      price,
      qty: 1,
      print:
        !hasPrint
          ? null
          : mode === 'image'
          ? { type: 'image', content: image, transform }
          : { type: 'text', content: text, color: textColor, font, transform },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="page constructor">
      <div className="container constructor__inner">
        <div className="constructor__preview">
          <div className="constructor__stage">
            <TShirt color={colorHex(color)} outline="#151515">
              <div
                className={`print-zone ${hasPrint ? 'has-print' : ''}`}
                style={{
                  left: `${PRINT_ZONE.left}%`,
                  top: `${PRINT_ZONE.top}%`,
                  width: `${PRINT_ZONE.width}%`,
                  height: `${PRINT_ZONE.height}%`,
                }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
              >
                {!hasPrint && <span className="print-zone__hint">Область печати</span>}
                {mode === 'image' && image && (
                  <img
                    src={image}
                    alt="Загруженный принт"
                    draggable={false}
                    className="print-zone__image"
                    style={{
                      transform: `translate(-50%, -50%) translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    }}
                  />
                )}
                {mode === 'text' && text.trim() && (
                  <div
                    className="print-zone__text"
                    style={{
                      color: textColor,
                      fontFamily: font === 'display' ? 'var(--font-display)' : 'var(--font-body)',
                      transform: `translate(-50%, -50%) translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    }}
                  >
                    {text}
                  </div>
                )}
              </div>
            </TShirt>
          </div>
          <p className="constructor__hint">Перетаскивай принт мышью прямо на футболке</p>
        </div>

        <div className="constructor__panel">
          <Reveal>
            <span className="eyebrow">Конструктор</span>
            <h1 className="constructor__title">{baseProduct.name}</h1>
            <p className="constructor__blurb">{baseProduct.blurb}</p>
          </Reveal>

          <div className="constructor__section">
            <span className="constructor__label">Принт</span>
            <div className="constructor__tabs">
              <button className={mode === 'image' ? 'is-active' : ''} onClick={() => setMode('image')}>
                Картинка
              </button>
              <button className={mode === 'text' ? 'is-active' : ''} onClick={() => setMode('text')}>
                Текст
              </button>
              <button className={mode === 'none' ? 'is-active' : ''} onClick={() => setMode('none')}>
                Без принта
              </button>
            </div>

            {mode === 'image' && (
              <div className="constructor__upload">
                <label className="constructor__upload-btn">
                  {image ? 'Заменить изображение' : 'Загрузить изображение'}
                  <input type="file" accept="image/*" onChange={onUpload} hidden />
                </label>
                {image && (
                  <div className="constructor__slider">
                    <span>Размер принта</span>
                    <input
                      type="range"
                      min="0.5"
                      max="1.8"
                      step="0.02"
                      value={transform.scale}
                      onChange={(e) => setTransform((t) => ({ ...t, scale: Number(e.target.value) }))}
                    />
                  </div>
                )}
              </div>
            )}

            {mode === 'text' && (
              <div className="constructor__textmode">
                <input
                  type="text"
                  maxLength={24}
                  placeholder="Напиши текст для принта"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="constructor__input"
                />
                <div className="constructor__row">
                  <div className="constructor__fonts">
                    {FONTS.map((f) => (
                      <button key={f.id} className={font === f.id ? 'is-active' : ''} onClick={() => setFont(f.id)}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="constructor__colorpick"
                    aria-label="Цвет текста"
                  />
                </div>
                {text.trim() && (
                  <div className="constructor__slider">
                    <span>Размер текста</span>
                    <input
                      type="range"
                      min="0.5"
                      max="1.8"
                      step="0.02"
                      value={transform.scale}
                      onChange={(e) => setTransform((t) => ({ ...t, scale: Number(e.target.value) }))}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="constructor__section">
            <span className="constructor__label">Модель</span>
            <div className="constructor__models">
              {PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  className={`constructor__model ${p.id === baseProduct.id ? 'is-active' : ''}`}
                  onClick={() => navigate(`/constructor/${p.id}`)}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="constructor__section">
            <span className="constructor__label">Цвет футболки</span>
            <div className="constructor__colors">
              {GARMENT_COLORS.filter((c) => baseProduct.colors.includes(c.id)).map((c) => (
                <button
                  key={c.id}
                  className={`constructor__swatch ${color === c.id ? 'is-active' : ''}`}
                  style={{ background: c.hex }}
                  onClick={() => setColor(c.id)}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="constructor__section">
            <span className="constructor__label">Размер</span>
            <div className="constructor__sizes">
              {SIZES.map((s) => (
                <button key={s} className={size === s ? 'is-active' : ''} onClick={() => setSize(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="constructor__footer">
            <div className="constructor__price">
              <span>Итого</span>
              <strong>{price.toLocaleString('ru-RU')} ₽</strong>
            </div>
            <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
              {added ? 'Добавлено ✓' : 'Добавить в корзину'}
            </button>
          </div>
          {added && (
            <button className="constructor__gocart" onClick={() => navigate('/cart')}>
              Перейти в корзину →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
