import { Link } from 'react-router-dom';
import logo from '../assets/logo/logo-white.svg';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__top">
          <img src={logo} alt="PrintFee" className="footer__logo" />
          <p className="footer__claim">
            Твой дизайн. <span className="accent-text">Твои правила.</span>
          </p>
        </div>

        <div className="footer__grid">
          <div className="footer__col">
            <span className="footer__title">Навигация</span>
            <Link to="/catalog">Каталог</Link>
            <Link to="/constructor">Конструктор</Link>
            <Link to="/about">О нас</Link>
          </div>
          <div className="footer__col">
            <span className="footer__title">Контакты</span>
            <a href="mailto:hello@printfee.ru">hello@printfee.ru</a>
            <a href="tel:+79990000000">+7 999 000-00-00</a>
            <span>Пн–Вс, 10:00–20:00</span>
          </div>
          <div className="footer__col">
            <span className="footer__title">Соцсети</span>
            <span className="footer__soon" title="Скоро откроем">Telegram</span>
            <span className="footer__soon" title="Скоро откроем">Instagram</span>
            <span className="footer__soon" title="Скоро откроем">VK</span>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} PrintFee — печать на футболках</span>
          <span>Сделано с любовью к принтам</span>
        </div>
      </div>
    </footer>
  );
}
