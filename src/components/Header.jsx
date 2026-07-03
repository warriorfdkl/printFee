import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo/logo-black.svg';
import { useCartStore } from '../store/cart';
import { cartCount } from '../store/cart';
import { useAuthStore } from '../store/auth';
import './Header.css';

const LINKS = [
  { to: '/catalog', label: 'Каталог' },
  { to: '/constructor', label: 'Конструктор' },
  { to: '/about', label: 'О нас' },
  { to: '/contacts', label: 'Контакты' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const count = cartCount(items);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        <Link to="/" className="header__logo" onClick={() => setOpen(false)}>
          <img src={logo} alt="PrintFee" />
        </Link>

        <nav className="header__nav">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `header__link ${isActive ? 'is-active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          <Link to="/account" className="header__account">
            {user ? user.name.split(' ')[0] : 'Кабинет'}
          </Link>
          <Link to="/cart" className="header__cart">
            <span>Корзина</span>
            <span className="header__cart-count">{count}</span>
          </Link>
          <button className={`header__burger ${open ? 'is-open' : ''}`} onClick={() => setOpen((v) => !v)} aria-label="Меню">
            <span />
            <span />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="header__mobile"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className="header__mobile-nav">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                >
                  <NavLink to={l.to} onClick={() => setOpen(false)}>
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + LINKS.length * 0.06 }}>
                <NavLink to="/cart" onClick={() => setOpen(false)}>
                  Корзина ({count})
                </NavLink>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + (LINKS.length + 1) * 0.06 }}>
                <NavLink to="/account" onClick={() => setOpen(false)}>
                  {user ? user.name.split(' ')[0] : 'Кабинет'}
                </NavLink>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
