import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { useAuthStore } from '../store/auth';
import { useCartStore } from '../store/cart';
import './Account.css';

function LoginForm() {
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const valid = form.name.trim().length > 1 && (form.email.trim() || form.phone.trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!valid) return;
    login({ ...form, joined: new Date().toISOString() });
  };

  return (
    <div className="page account">
      <div className="container account__auth">
        <Reveal>
          <span className="eyebrow">Личный кабинет</span>
          <h1 className="account__title">Вход в кабинет</h1>
          <p className="account__lead">
            Тестовая версия входа — без пароля. Достаточно имени и почты или телефона, чтобы посмотреть,
            как будет выглядеть кабинет с историей заказов.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="account__form-wrap">
          <form className="account__form" onSubmit={handleSubmit}>
            <label>
              Имя
              <input type="text" value={form.name} onChange={update('name')} placeholder="Как к вам обращаться" />
            </label>
            <label>
              Email
              <input type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" />
            </label>
            <label>
              Телефон
              <input type="tel" value={form.phone} onChange={update('phone')} placeholder="+7 999 000-00-00" />
            </label>
            <button type="submit" className="btn btn-primary btn-lg" disabled={!valid}>
              Войти
            </button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}

export default function Account() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const orders = useCartStore((s) => s.orders);

  if (!user) return <LoginForm />;

  return (
    <div className="page account">
      <div className="container">
        <Reveal className="account__head">
          <div>
            <span className="eyebrow">Личный кабинет</span>
            <h1 className="account__title">Привет, {user.name}</h1>
          </div>
          <button className="btn btn-outline" onClick={logout}>
            Выйти
          </button>
        </Reveal>

        <Reveal delay={0.08} className="account__profile">
          <div className="account__profile-row">
            <span>Имя</span>
            <strong>{user.name}</strong>
          </div>
          {user.email && (
            <div className="account__profile-row">
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>
          )}
          {user.phone && (
            <div className="account__profile-row">
              <span>Телефон</span>
              <strong>{user.phone}</strong>
            </div>
          )}
        </Reveal>

        <Reveal delay={0.14}>
          <h2 className="account__orders-title">История заказов</h2>
        </Reveal>

        {orders.length === 0 ? (
          <Reveal delay={0.18} className="account__empty">
            <p>Заказов пока нет.</p>
            <Link to="/constructor" className="btn btn-primary">Собрать первую футболку</Link>
          </Reveal>
        ) : (
          <div className="account__orders">
            {orders.map((order, i) => (
              <Reveal key={order.number} delay={Math.min(i * 0.06, 0.3)} className="account__order">
                <div className="account__order-head">
                  <span>Заказ №{order.number}</span>
                  <span>{new Date(order.date).toLocaleDateString('ru-RU')}</span>
                </div>
                <div className="account__order-items">
                  {order.items.map((item) => (
                    <span key={item.id}>
                      {item.name} × {item.qty}
                    </span>
                  ))}
                </div>
                <div className="account__order-total">
                  <span>Сумма</span>
                  <strong>{order.total.toLocaleString('ru-RU')} ₽</strong>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
