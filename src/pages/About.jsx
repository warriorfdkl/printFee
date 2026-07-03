import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import Marquee from '../components/Marquee';
import './About.css';

const VALUES = [
  { n: '01', title: 'Малые тиражи', text: 'Печатаем от одной футболки — не заставляем заказывать партиями' },
  { n: '02', title: 'Контроль качества', text: 'Каждый заказ проверяется перед отправкой вручную' },
  { n: '03', title: 'Прозрачный ценник', text: 'Цена в конструкторе — это цена, которую вы платите' },
  { n: '04', title: 'Быстрое производство', text: 'От заявки до готовой футболки — 2–4 рабочих дня' },
];

export default function About() {
  return (
    <div className="page about">
      <div className="container">
        <Reveal>
          <span className="eyebrow">О нас</span>
          <h1 className="about__title">
            Мы делаем печать
            <br />
            <span className="accent-text">простой и честной</span>
          </h1>
          <p className="about__lead">
            PrintFee — небольшая студия печати на футболках. Мы начинали с заказов для друзей и локальных
            брендов, а сегодня даём каждому возможность собрать свой принт в конструкторе и получить
            готовую вещь без минимального тиража и переплат за посредников.
          </p>
        </Reveal>
      </div>

      <Marquee text="Печатаем с 2021 года" speed={24} />

      <section className="section about__values">
        <div className="container about__values-grid">
          {VALUES.map((v, i) => (
            <Reveal key={v.n} delay={i * 0.08}>
              <div className="about__value">
                <span>{v.n}</span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section statement">
        <div className="container statement__inner">
          <Reveal>
            <h2 className="statement__title">Готовы напечатать твою идею</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link to="/constructor" className="btn btn-primary btn-lg">Начать в конструкторе</Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
