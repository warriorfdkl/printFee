import { useState } from 'react';
import Reveal from '../components/Reveal';
import './Contacts.css';

export default function Contacts() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', contact: '', message: '' });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="page contacts">
      <div className="container contacts__inner">
        <div className="contacts__info">
          <Reveal>
            <span className="eyebrow">Контакты</span>
            <h1 className="contacts__title">Есть вопрос? Напиши нам</h1>
            <p className="contacts__lead">
              Отвечаем в течение пары часов в рабочее время. Поможем подобрать модель, ткань и разберём
              сложный макет.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="contacts__list">
            <div className="contacts__item">
              <span>Почта</span>
              <a href="mailto:hello@printfee.ru">hello@printfee.ru</a>
            </div>
            <div className="contacts__item">
              <span>Телефон</span>
              <a href="tel:+79990000000">+7 999 000-00-00</a>
            </div>
            <div className="contacts__item">
              <span>Часы работы</span>
              <p>Пн–Вс, 10:00–20:00</p>
            </div>
            <div className="contacts__item">
              <span>Мастерская</span>
              <p>Москва, печатаем и отправляем по всей России</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="contacts__form-wrap">
          {sent ? (
            <div className="contacts__sent">
              <h3>Сообщение отправлено</h3>
              <p>Спасибо! Мы свяжемся с вами в ближайшее время.</p>
            </div>
          ) : (
            <form className="contacts__form" onSubmit={handleSubmit}>
              <label>
                Имя
                <input type="text" required value={form.name} onChange={update('name')} placeholder="Ваше имя" />
              </label>
              <label>
                Телефон или почта
                <input type="text" required value={form.contact} onChange={update('contact')} placeholder="Как с вами связаться" />
              </label>
              <label>
                Сообщение
                <textarea rows={4} value={form.message} onChange={update('message')} placeholder="Расскажите, что нужно" />
              </label>
              <button type="submit" className="btn btn-primary btn-lg">Отправить</button>
            </form>
          )}
        </Reveal>
      </div>
    </div>
  );
}
