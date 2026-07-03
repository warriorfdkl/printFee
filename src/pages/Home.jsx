import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Reveal from '../components/Reveal';
import Marquee from '../components/Marquee';
import TShirt from '../components/TShirt';
import logoMark from '../assets/logo/mark.svg';
import { PRODUCTS } from '../data/products';
import './Home.css';

const HEADLINE = ['Печать,', 'которую', 'придумал', 'ты сам'];

const STEPS = [
  { n: '01', title: 'Загрузи макет', text: 'Своя картинка, лого или текст — в конструкторе на сайте' },
  { n: '02', title: 'Выбери футболку', text: 'Крой, цвет, размер, плотность ткани — под себя' },
  { n: '03', title: 'Оформи заказ', text: 'Оставь контакты — мы свяжемся и подтвердим детали' },
  { n: '04', title: 'Получи и носи', text: 'Печатаем и передаём в производство за 2–4 дня' },
];

const FEATURES = [
  { title: 'Плотный хлопок', text: '180–240 г/м², держит форму после стирок' },
  { title: 'DTF-печать', text: 'Яркий цвет, не трескается и не выгорает' },
  { title: 'Свой конструктор', text: 'Видишь результат до того, как оплатишь' },
  { title: 'Малые тиражи', text: 'От одной футболки — без минимальной партии' },
];

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const shirtY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const shirtRotate = useTransform(scrollYProgress, [0, 1], [-6, 4]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="home">
      <section className="hero" ref={heroRef}>
        <div className="container hero__inner">
          <motion.div className="hero__copy" style={{ opacity: fade }}>
            <span className="eyebrow">Печать на футболках на заказ</span>
            <h1 className="hero__title">
              {HEADLINE.map((word, i) => (
                <span className="hero__title-line" key={word}>
                  <motion.span
                    className={i === 3 ? 'accent-text' : ''}
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p
              className="hero__subtitle"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65 }}
            >
              Конструктор принта, честный ценник и футболки, которые реально хочется носить.
              Без минимального тиража — печатаем хоть одну штуку.
            </motion.p>
            <motion.div
              className="hero__actions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link to="/constructor" className="btn btn-primary">Создать принт →</Link>
              <Link to="/catalog" className="btn btn-outline">Смотреть каталог</Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero__visual"
            style={{ y: shirtY, rotate: shirtRotate }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <TShirt color="#151515" outline="#151515">
              <img src={logoMark} alt="" className="hero__visual-print" />
            </TShirt>
            <div className="hero__badge">
              <span>от</span>
              <strong>1990 ₽</strong>
            </div>
          </motion.div>
        </div>
        <div className="hero__scroll">
          <span />
          прокрути вниз
        </div>
      </section>

      <Marquee text="Свой дизайн — свои правила" speed={26} />

      <section className="section process">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Как это работает</span>
            <h2 className="section__title">От идеи до футболки — четыре шага</h2>
          </Reveal>

          <div className="process__grid">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="process__card">
                  <span className="process__n">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section featured">
        <div className="container">
          <Reveal className="featured__head">
            <div>
              <span className="eyebrow">Каталог</span>
              <h2 className="section__title">Базовые модели для твоего принта</h2>
            </div>
            <Link to="/catalog" className="btn btn-outline">Весь каталог</Link>
          </Reveal>

          <div className="featured__grid">
            {PRODUCTS.slice(0, 4).map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <Link to={`/constructor/${p.id}`} className="product-card">
                  <div className="product-card__visual">
                    <TShirt color="#f2f1ee" outline="#151515" />
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
        </div>
      </section>

      <section className="section statement">
        <div className="container statement__inner">
          <Reveal>
            <h2 className="statement__title">
              Не нашёл что искал в каталоге?
              <br />
              <span className="accent-text">Придумай сам.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link to="/constructor" className="btn btn-primary btn-lg">Открыть конструктор</Link>
          </Reveal>
        </div>
      </section>

      <Marquee text="Печать • Дизайн • Ты" speed={22} dark />

      <section className="section features">
        <div className="container features__grid">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <div className="feature-card">
                <span className="feature-card__index">{String(i + 1).padStart(2, '0')}</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
