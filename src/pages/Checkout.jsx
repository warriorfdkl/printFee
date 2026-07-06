import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '../components/Reveal';
import Spinner from '../components/Spinner';
import { useCartStore, cartTotal } from '../store/cart';
import { useAuthStore } from '../store/auth';
import './Checkout.css';

const DELIVERY_OPTIONS = [
  { id: 'courier', label: 'Курьером по городу', price: 300 },
  { id: 'pickup', label: 'Самовывоз', price: 0 },
  { id: 'post', label: 'Почтой в другой город', price: 400 },
];

export default function Checkout() {
  const items = useCartStore((s) => s.items);
  const placeOrder = useCartStore((s) => s.placeOrder);
  const lastOrder = useCartStore((s) => s.lastOrder);
  const user = useAuthStore((s) => s.user);

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    comment: '',
  });
  const [delivery, setDelivery] = useState('courier');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const total = cartTotal(items);
  const deliveryPrice = DELIVERY_OPTIONS.find((d) => d.id === delivery)?.price || 0;

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const valid =
    form.name.trim().length > 1 &&
    form.phone.trim().length > 5 &&
    (delivery === 'pickup' || form.address.trim().length > 4);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      placeOrder({ ...form, delivery });
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  if (submitted && lastOrder) {
    return (
      <div className="page checkout checkout--done">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="checkout__done"
          >
            <span className="eyebrow">Заказ оформлен</span>
            <h1>
              Заказ <span className="accent-text">№{lastOrder.number}</span> принят
            </h1>
            <p>
              Спасибо, {lastOrder.customer.name}! Мы свяжемся с тобой по телефону {lastOrder.customer.phone} в течение
              рабочего дня, чтобы подтвердить детали и способ оплаты.
            </p>
            <div className="checkout__done-total">
              <span>Сумма заказа</span>
              <strong>{lastOrder.total.toLocaleString('ru-RU')} ₽</strong>
            </div>
            <div className="checkout__done-actions">
              <Link to="/" className="btn btn-primary">На главную</Link>
              <Link to="/constructor" className="btn btn-outline">Собрать ещё одну</Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="page checkout">
      <div className="container checkout__inner">
        <form className="checkout__form" onSubmit={handleSubmit}>
          <Reveal>
            <span className="eyebrow">Оформление</span>
            <h1 className="checkout__title">Оформи заказ</h1>
          </Reveal>

          <div className="checkout__fields">
            <label>
              Имя
              <input type="text" required value={form.name} onChange={update('name')} placeholder="Как к вам обращаться" />
            </label>
            <label>
              Телефон
              <input type="tel" required value={form.phone} onChange={update('phone')} placeholder="+7 999 000-00-00" />
            </label>
            <label>
              Email
              <input type="email" value={form.email} onChange={update('email')} placeholder="для чека и статуса заказа" />
            </label>

            <div className="checkout__delivery">
              <span className="checkout__label">Доставка</span>
              <div className="checkout__delivery-options">
                {DELIVERY_OPTIONS.map((d) => (
                  <button
                    type="button"
                    key={d.id}
                    className={`checkout__delivery-option ${delivery === d.id ? 'is-active' : ''}`}
                    onClick={() => setDelivery(d.id)}
                  >
                    <span>{d.label}</span>
                    <span>{d.price ? `${d.price} ₽` : 'Бесплатно'}</span>
                  </button>
                ))}
              </div>
            </div>

            {delivery !== 'pickup' && (
              <label>
                Адрес
                <input type="text" required value={form.address} onChange={update('address')} placeholder="Город, улица, дом, квартира" />
              </label>
            )}

            <label>
              Комментарий к заказу
              <textarea rows={3} value={form.comment} onChange={update('comment')} placeholder="Пожелания по печати, срокам и т.д." />
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-lg checkout__submit" disabled={!valid || submitting}>
            {submitting ? (
              <>
                <Spinner size={16} /> Оформляем заказ…
              </>
            ) : (
              'Подтвердить заказ'
            )}
          </button>
          <p className="checkout__legal">
            Нажимая «Подтвердить заказ», ты соглашаешься на обработку персональных данных. Оплата на сайте не производится —
            с тобой свяжется менеджер.
          </p>
        </form>

        <aside className="checkout__summary">
          <h3>Ваш заказ</h3>
          <div className="checkout__summary-list">
            {items.map((item) => (
              <div className="checkout__summary-item" key={item.id}>
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>{(item.price * item.qty).toLocaleString('ru-RU')} ₽</span>
              </div>
            ))}
          </div>
          <div className="checkout__summary-row">
            <span>Доставка</span>
            <span>{deliveryPrice ? `${deliveryPrice} ₽` : 'Бесплатно'}</span>
          </div>
          <div className="checkout__summary-total">
            <span>Итого</span>
            <strong>{(total + deliveryPrice).toLocaleString('ru-RU')} ₽</strong>
          </div>
        </aside>
      </div>
    </div>
  );
}
