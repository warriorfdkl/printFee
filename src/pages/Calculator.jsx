import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import Spinner from '../components/Spinner';
import TShirt from '../components/TShirt';
import { GARMENT_COLORS, colorHex } from '../data/products';
import './Calculator.css';

const GARMENT_TYPES = [
  { id: 'classic', label: 'Классика', price: 1990 },
  { id: 'oversize', label: 'Оверсайз', price: 2440 },
  { id: 'unisex', label: 'Крой унисекс', price: 2040 },
  { id: 'limited', label: 'Лимитка', price: 2940 },
];

const PRINT_TYPES = [
  { id: 'image', label: 'Картинка / лого', price: 400 },
  { id: 'text', label: 'Текст', price: 250 },
];

const PRINT_SIZES = [
  { id: 'a6', label: 'Маленький', hint: 'до А6, ~10×10 см', extra: 0 },
  { id: 'a5', label: 'Средний', hint: 'А5, ~15×20 см', extra: 200 },
  { id: 'a4', label: 'Большой', hint: 'А4, ~21×30 см', extra: 400 },
  { id: 'a3', label: 'Во всю грудь', hint: 'А3+, ~30×40 см', extra: 700 },
];

const PRINT_METHODS = [
  { id: 'dtf', label: 'DTF-перенос', note: 'Наш стандартный способ · 2–4 рабочих дня', extra: 0 },
  { id: 'express', label: 'Срочная печать', note: 'В приоритете · 1–2 рабочих дня', extra: 300 },
];

const QTY_PRESETS = [1, 3, 5, 10, 20, 50];

const CONTACT_CHANNELS = [
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'phone', label: 'Звонок' },
];

const STEPS = [
  { n: 1, label: 'Изделие' },
  { n: 2, label: 'Печать' },
  { n: 3, label: 'Контакты' },
];

function discountFor(qty) {
  if (qty >= 30) return 30;
  if (qty >= 10) return 20;
  if (qty >= 3) return 10;
  return 0;
}

export default function Calculator() {
  const [step, setStep] = useState(1);

  const [garment, setGarment] = useState(GARMENT_TYPES[0].id);
  const [color, setColor] = useState(GARMENT_COLORS[0].id);
  const [qty, setQty] = useState(3);

  const [printType, setPrintType] = useState('image');
  const [printSize, setPrintSize] = useState('a5');
  const [printMethod, setPrintMethod] = useState('dtf');

  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [channel, setChannel] = useState('whatsapp');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [leadNumber, setLeadNumber] = useState(null);

  const garmentObj = GARMENT_TYPES.find((g) => g.id === garment);
  const colorSurcharge = color === 'white' ? 0 : 100;
  const printSurcharge = PRINT_TYPES.find((p) => p.id === printType).price;
  const sizeObj = PRINT_SIZES.find((s) => s.id === printSize);
  const methodObj = PRINT_METHODS.find((m) => m.id === printMethod);

  const unitPrice = garmentObj.price + colorSurcharge + printSurcharge + sizeObj.extra + methodObj.extra;
  const subtotal = unitPrice * qty;
  const discountPct = discountFor(qty);
  const total = Math.round(subtotal * (1 - discountPct / 100));

  const onQtyInput = (e) => {
    const v = Math.max(1, Math.min(999, Number(e.target.value) || 1));
    setQty(v);
  };

  const onFile = (e) => setFile(e.target.files?.[0] || null);

  const canSubmit = name.trim().length > 1 && phone.trim().length > 5;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setLeadNumber(Math.floor(100000 + Math.random() * 900000));
      setSubmitted(true);
    }, 900);
  };

  if (submitted) {
    return (
      <div className="page calculator calculator--done">
        <div className="container">
          <Reveal className="calculator__done">
            <span className="eyebrow">Заявка отправлена</span>
            <h1>
              Заявка <span className="accent-text">№{leadNumber}</span> принята
            </h1>
            <p>
              Спасибо, {name}! Ориентировочный расчёт — {total.toLocaleString('ru-RU')} ₽ за {qty}{' '}
              шт. {channel === 'phone'
                ? 'Мы позвоним вам'
                : `Мы напишем вам в ${CONTACT_CHANNELS.find((c) => c.id === channel).label}`}{' '}
              и уточним макет, сроки и финальную стоимость.
            </p>
            <div className="calculator__done-actions">
              <Link to="/" className="btn btn-primary">На главную</Link>
              <Link to="/constructor" className="btn btn-outline">Собрать одну футболку</Link>
            </div>
          </Reveal>
        </div>
      </div>
    );
  }

  return (
    <div className="page calculator">
      <div className="container">
        <Reveal>
          <span className="eyebrow">Калькулятор</span>
          <h1 className="calculator__title">Посчитай стоимость тиража</h1>
          <p className="calculator__lead">
            Для одной футболки удобнее «Конструктор» — там сразу видно превью. Здесь считаем тираж
            от нескольких штук и сразу отправляем заявку менеджеру на точный расчёт.
          </p>
        </Reveal>

        <div className="calculator__steps">
          {STEPS.map((s) => (
            <button
              key={s.n}
              className={`calculator__step ${step === s.n ? 'is-active' : ''} ${step > s.n ? 'is-done' : ''}`}
              onClick={() => setStep(s.n)}
              type="button"
            >
              <span className="calculator__step-n">{s.n}</span>
              {s.label}
            </button>
          ))}
        </div>

        <div className="calculator__layout">
          <form className="calculator__form" onSubmit={handleSubmit}>
            {step === 1 && (
              <Reveal className="calculator__section">
                <span className="calculator__label">Тип футболки</span>
                <div className="calculator__chips">
                  {GARMENT_TYPES.map((g) => (
                    <button
                      type="button"
                      key={g.id}
                      className={`calculator__chip ${garment === g.id ? 'is-active' : ''}`}
                      onClick={() => setGarment(g.id)}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>

                <span className="calculator__label">Цвет</span>
                <div className="calculator__swatches">
                  {GARMENT_COLORS.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      className={`calculator__swatch ${color === c.id ? 'is-active' : ''}`}
                      style={{ background: c.hex }}
                      onClick={() => setColor(c.id)}
                      title={c.name}
                      aria-label={c.name}
                    />
                  ))}
                </div>

                <span className="calculator__label">Количество</span>
                <div className="calculator__qty-presets">
                  {QTY_PRESETS.map((n) => (
                    <button
                      type="button"
                      key={n}
                      className={`calculator__chip ${qty === n ? 'is-active' : ''}`}
                      onClick={() => setQty(n)}
                    >
                      {n} шт
                    </button>
                  ))}
                  <input
                    type="number"
                    min="1"
                    max="999"
                    className="calculator__qty-input"
                    value={qty}
                    onChange={onQtyInput}
                    aria-label="Своё количество"
                  />
                </div>
                {discountPct > 0 && (
                  <p className="calculator__discount-note">
                    Скидка за тираж {discountPct}% уже учтена в расчёте справа.
                  </p>
                )}

                <div className="calculator__nav">
                  <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
                    Далее →
                  </button>
                </div>
              </Reveal>
            )}

            {step === 2 && (
              <Reveal className="calculator__section">
                <span className="calculator__label">Что печатаем</span>
                <div className="calculator__chips">
                  {PRINT_TYPES.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      className={`calculator__chip ${printType === p.id ? 'is-active' : ''}`}
                      onClick={() => setPrintType(p.id)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <span className="calculator__label">Размер принта</span>
                <div className="calculator__sizes">
                  {PRINT_SIZES.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      className={`calculator__size ${printSize === s.id ? 'is-active' : ''}`}
                      onClick={() => setPrintSize(s.id)}
                    >
                      <span>{s.label}</span>
                      <span className="calculator__size-hint">{s.hint}</span>
                    </button>
                  ))}
                </div>

                <span className="calculator__label">Способ печати</span>
                <div className="calculator__methods">
                  {PRINT_METHODS.map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      className={`calculator__method ${printMethod === m.id ? 'is-active' : ''}`}
                      onClick={() => setPrintMethod(m.id)}
                    >
                      <span>{m.label}</span>
                      <span className="calculator__method-note">{m.note}</span>
                    </button>
                  ))}
                </div>

                <div className="calculator__nav">
                  <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
                    ← Назад
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
                    Далее →
                  </button>
                </div>
              </Reveal>
            )}

            {step === 3 && (
              <Reveal className="calculator__section">
                <span className="calculator__label">Макет (не обязательно)</span>
                <label className="calculator__upload-btn">
                  {file ? file.name : 'Прикрепить файл'}
                  <input type="file" accept="image/*,.pdf,.ai,.psd" onChange={onFile} hidden />
                </label>

                <span className="calculator__label">Имя</span>
                <input
                  type="text"
                  className="calculator__input"
                  placeholder="Как к вам обращаться"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <span className="calculator__label">Как удобнее связаться</span>
                <div className="calculator__chips">
                  {CONTACT_CHANNELS.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      className={`calculator__chip ${channel === c.id ? 'is-active' : ''}`}
                      onClick={() => setChannel(c.id)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                <span className="calculator__label">Телефон</span>
                <input
                  type="tel"
                  className="calculator__input"
                  placeholder="+7 999 000-00-00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <div className="calculator__nav">
                  <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>
                    ← Назад
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={!canSubmit || submitting}>
                    {submitting ? (
                      <>
                        <Spinner size={16} /> Отправляем…
                      </>
                    ) : (
                      'Отправить заявку'
                    )}
                  </button>
                </div>
                <p className="calculator__legal">
                  Расчёт ориентировочный и не является офертой — точную стоимость и сроки менеджер
                  подтвердит после уточнения макета.
                </p>
              </Reveal>
            )}
          </form>

          <aside className="calculator__summary">
            <div className="calculator__summary-visual">
              <TShirt color={colorHex(color)} outline="#151515" />
            </div>
            <h3>Ваш расчёт</h3>
            <div className="calculator__summary-row">
              <span>Футболка</span>
              <span>{garmentObj.label}</span>
            </div>
            <div className="calculator__summary-row">
              <span>Цвет</span>
              <span>{GARMENT_COLORS.find((c) => c.id === color).name}</span>
            </div>
            <div className="calculator__summary-row">
              <span>Печать</span>
              <span>{PRINT_TYPES.find((p) => p.id === printType).label}</span>
            </div>
            <div className="calculator__summary-row">
              <span>Размер принта</span>
              <span>{sizeObj.label}</span>
            </div>
            <div className="calculator__summary-row">
              <span>Способ</span>
              <span>{methodObj.label}</span>
            </div>
            <div className="calculator__summary-row">
              <span>Цена за штуку</span>
              <span>{unitPrice.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div className="calculator__summary-row">
              <span>Количество</span>
              <span>{qty} шт</span>
            </div>
            {discountPct > 0 && (
              <div className="calculator__summary-row calculator__summary-row--discount">
                <span>Скидка за тираж</span>
                <span>−{discountPct}%</span>
              </div>
            )}
            <div className="calculator__summary-total">
              <span>Итого</span>
              <strong>{total.toLocaleString('ru-RU')} ₽</strong>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
