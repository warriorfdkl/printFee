import { Link, useNavigate } from 'react-router-dom';
import Reveal from '../components/Reveal';
import TShirt, { PRINT_ZONES } from '../components/TShirt';
import { useCartStore, cartTotal } from '../store/cart';
import { colorHex, colorName, fontFamilyFor } from '../data/products';
import './Cart.css';

function ItemPreview({ item }) {
  const zone = PRINT_ZONES.front;
  const frontLayers = item.print?.views?.front || [];

  return (
    <TShirt color={colorHex(item.color)} outline="#151515">
      {frontLayers.length > 0 && (
        <div
          className="print-zone"
          style={{
            left: `${zone.left}%`,
            top: `${zone.top}%`,
            width: `${zone.width}%`,
            height: `${zone.height}%`,
          }}
        >
          {frontLayers.map((l) => (
            <div
              key={l.id}
              className="print-zone__layer"
              style={{
                width: l.type === 'image' ? '130%' : '160%',
                transform: `translate(-50%, -50%) translate(${l.x}px, ${l.y}px) rotate(${l.rotation}deg) scale(${l.scale})`,
              }}
            >
              {l.type === 'image' ? (
                <img src={l.content} alt="" className="print-zone__image" />
              ) : (
                <span className="print-zone__text" style={{ color: l.color, fontFamily: fontFamilyFor(l.font) }}>
                  {l.text}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </TShirt>
  );
}

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const setQty = useCartStore((s) => s.setQty);
  const navigate = useNavigate();
  const total = cartTotal(items);

  if (items.length === 0) {
    return (
      <div className="page cart cart--empty">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Корзина</span>
            <h1 className="cart__empty-title">Пока пусто</h1>
            <p className="cart__empty-text">Собери свою футболку в конструкторе или выбери модель в каталоге.</p>
            <div className="cart__empty-actions">
              <Link to="/constructor" className="btn btn-primary">Открыть конструктор</Link>
              <Link to="/catalog" className="btn btn-outline">В каталог</Link>
            </div>
          </Reveal>
        </div>
      </div>
    );
  }

  return (
    <div className="page cart">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Корзина</span>
          <h1 className="cart__title">Твой заказ</h1>
        </Reveal>

        <div className="cart__layout">
          <div className="cart__list">
            {items.map((item) => (
              <div className="cart__item" key={item.id}>
                <div className="cart__item-visual">
                  <ItemPreview item={item} />
                </div>
                <div className="cart__item-info">
                  <div className="cart__item-head">
                    <h3>{item.name}</h3>
                    <button className="cart__remove" onClick={() => removeItem(item.id)} aria-label="Удалить">
                      Удалить
                    </button>
                  </div>
                  <p className="cart__item-meta">
                    {colorName(item.color)} · Размер {item.size} · {item.print ? 'С принтом' : 'Без принта'}
                    {item.print?.views?.back?.length ? ' + спина' : ''}
                    {item.print?.views?.sleeve?.length ? ' + рукав' : ''}
                  </p>
                  <div className="cart__item-footer">
                    <div className="cart__qty">
                      <button onClick={() => setQty(item.id, item.qty - 1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => setQty(item.id, item.qty + 1)}>+</button>
                    </div>
                    <span className="cart__item-price">{(item.price * item.qty).toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart__summary">
            <h3>Итого</h3>
            <div className="cart__summary-row">
              <span>Товары ({items.reduce((s, i) => s + i.qty, 0)})</span>
              <span>{total.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div className="cart__summary-row">
              <span>Доставка</span>
              <span>По согласованию</span>
            </div>
            <div className="cart__summary-total">
              <span>К оплате</span>
              <strong>{total.toLocaleString('ru-RU')} ₽</strong>
            </div>
            <button className="btn btn-primary btn-lg cart__checkout" onClick={() => navigate('/checkout')}>
              Оформить заказ
            </button>
            <p className="cart__note">Оплата не списывается на сайте — мы свяжемся для подтверждения.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
