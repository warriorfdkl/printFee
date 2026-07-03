import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="page not-found">
      <div className="container not-found__inner">
        <Reveal>
          <span className="eyebrow">404</span>
          <h1 className="not-found__title">
            Такой страницы <span className="accent-text">не существует</span>
          </h1>
          <p className="not-found__text">Похоже, страница переехала или адрес введён с ошибкой.</p>
          <div className="not-found__actions">
            <Link to="/" className="btn btn-primary">На главную</Link>
            <Link to="/catalog" className="btn btn-outline">В каталог</Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
