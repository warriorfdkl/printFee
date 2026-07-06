import { useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Reveal from '../components/Reveal';
import Spinner from '../components/Spinner';
import TShirt, { VIEWS, PRINT_ZONES } from '../components/TShirt';
import { PRODUCTS, GARMENT_COLORS, SIZES, colorHex, FONTS, fontFamilyFor } from '../data/products';
import { useCartStore } from '../store/cart';
import './Constructor.css';

const PRINT_SURCHARGE = { image: 400, text: 250 };
const MAX_IMAGE_DIMENSION = 1200;
const DRAG_BOUND = 90;

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(img.src);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

let uid = 0;
const nextLayerId = () => `l${Date.now()}-${uid++}`;
const emptyLayers = () => ({ front: [], back: [], sleeve: [] });

export default function Constructor() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  const baseProduct = useMemo(
    () => PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0],
    [productId]
  );

  const [color, setColor] = useState(baseProduct.colors[0]);
  const [size, setSize] = useState('M');
  const [view, setView] = useState('front');
  const [layersByView, setLayersByView] = useState(emptyLayers);
  const [selectedId, setSelectedId] = useState(null);
  const [added, setAdded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [saveError, setSaveError] = useState(false);

  const dragState = useRef(null);

  const layers = layersByView[view];
  const selectedLayer = layers.find((l) => l.id === selectedId) || null;
  const zone = PRINT_ZONES[view];
  const viewLabel = VIEWS.find((v) => v.id === view).label;

  const allLayers = Object.values(layersByView).flat();
  const hasPrint = allLayers.length > 0;
  const printSurcharge = allLayers.reduce((sum, l) => sum + PRINT_SURCHARGE[l.type], 0);
  const price = baseProduct.price + printSurcharge;

  const updateViewLayers = (updater) => {
    setLayersByView((prev) => ({ ...prev, [view]: updater(prev[view]) }));
  };

  const patchLayer = (id, patch) => {
    updateViewLayers((arr) => arr.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const removeLayer = (id) => {
    updateViewLayers((arr) => arr.filter((l) => l.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const addTextLayer = () => {
    const layer = {
      id: nextLayerId(),
      type: 'text',
      text: 'Текст',
      color: '#ffffff',
      font: 'display',
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
    };
    updateViewLayers((arr) => [...arr, layer]);
    setSelectedId(layer.id);
  };

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    setUploading(true);
    try {
      const content = await resizeImage(file);
      const layer = { id: nextLayerId(), type: 'image', content, x: 0, y: 0, scale: 1, rotation: 0 };
      updateViewLayers((arr) => [...arr, layer]);
      setSelectedId(layer.id);
    } catch {
      setUploadError('Не получилось обработать файл — попробуй другое изображение');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const onLayerPointerDown = (e, id) => {
    e.stopPropagation();
    setSelectedId(id);
    const layer = layers.find((l) => l.id === id);
    dragState.current = { id, startX: e.clientX, startY: e.clientY, origin: { x: layer.x, y: layer.y } };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onZonePointerMove = (e) => {
    if (!dragState.current) return;
    const { id, startX, startY, origin } = dragState.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    patchLayer(id, {
      x: Math.max(-DRAG_BOUND, Math.min(DRAG_BOUND, origin.x + dx)),
      y: Math.max(-DRAG_BOUND, Math.min(DRAG_BOUND, origin.y + dy)),
    });
  };

  const onZonePointerUp = () => {
    dragState.current = null;
  };

  const switchView = (v) => {
    setView(v);
    setSelectedId(null);
  };

  const handleAddToCart = () => {
    const views = {};
    for (const v of Object.keys(layersByView)) {
      if (layersByView[v].length) views[v] = layersByView[v];
    }
    const saved = addItem({
      productId: baseProduct.id,
      name: baseProduct.name,
      color,
      size,
      price,
      qty: 1,
      print: hasPrint ? { views } : null,
    });
    if (!saved) {
      setSaveError(true);
      return;
    }
    setSaveError(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="page constructor">
      <div className="container constructor__inner">
        <div className="constructor__preview">
          <div className="constructor__tabs constructor__view-tabs">
            {VIEWS.map((v) => (
              <button key={v.id} className={view === v.id ? 'is-active' : ''} onClick={() => switchView(v.id)}>
                {v.label}
                {layersByView[v.id].length > 0 && <span className="constructor__view-dot" />}
              </button>
            ))}
          </div>

          <div className="constructor__stage">
            <TShirt color={colorHex(color)} outline="#151515" view={view}>
              <div
                className={`print-zone ${layers.length ? 'has-print' : ''}`}
                style={{
                  left: `${zone.left}%`,
                  top: `${zone.top}%`,
                  width: `${zone.width}%`,
                  height: `${zone.height}%`,
                }}
                onPointerDown={() => setSelectedId(null)}
                onPointerMove={onZonePointerMove}
                onPointerUp={onZonePointerUp}
                onPointerLeave={onZonePointerUp}
              >
                {uploading && (
                  <span className="print-zone__loading">
                    <Spinner size={22} />
                  </span>
                )}
                {!uploading && layers.length === 0 && (
                  <span className="print-zone__hint">Область печати · {viewLabel}</span>
                )}
                {layers.map((l) => (
                  <div
                    key={l.id}
                    className={`print-zone__layer ${selectedId === l.id ? 'is-selected' : ''}`}
                    style={{
                      width: l.type === 'image' ? '130%' : '160%',
                      transform: `translate(-50%, -50%) translate(${l.x}px, ${l.y}px) rotate(${l.rotation}deg) scale(${l.scale})`,
                    }}
                    onPointerDown={(e) => onLayerPointerDown(e, l.id)}
                  >
                    {l.type === 'image' ? (
                      <img src={l.content} alt="Загруженный принт" draggable={false} className="print-zone__image" />
                    ) : (
                      <span
                        className="print-zone__text"
                        style={{ color: l.color, fontFamily: fontFamilyFor(l.font) }}
                      >
                        {l.text}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </TShirt>
          </div>
          <p className="constructor__hint">Перетаскивай элементы, чтобы разместить их на футболке</p>
        </div>

        <div className="constructor__panel">
          <Reveal>
            <span className="eyebrow">Конструктор</span>
            <h1 className="constructor__title">{baseProduct.name}</h1>
            <p className="constructor__blurb">{baseProduct.blurb}</p>
          </Reveal>

          <div className="constructor__section">
            <span className="constructor__label">Добавить на «{viewLabel.toLowerCase()}»</span>
            <div className="constructor__add-row">
              <label className={`constructor__upload-btn ${uploading ? 'is-disabled' : ''}`}>
                {uploading ? (
                  <>
                    <Spinner size={15} /> Загружаем…
                  </>
                ) : (
                  '+ Картинка'
                )}
                <input type="file" accept="image/*" onChange={onUpload} disabled={uploading} hidden />
              </label>
              <button type="button" className="constructor__upload-btn" onClick={addTextLayer}>
                + Текст
              </button>
            </div>
            {uploadError && <p className="constructor__error">{uploadError}</p>}
          </div>

          {layers.length > 0 && (
            <div className="constructor__section">
              <span className="constructor__label">Слои на «{viewLabel.toLowerCase()}»</span>
              <div className="constructor__layers">
                {layers.map((l, i) => (
                  <div
                    key={l.id}
                    className={`constructor__layer-row ${selectedId === l.id ? 'is-active' : ''}`}
                    onClick={() => setSelectedId(l.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setSelectedId(l.id);
                    }}
                  >
                    <span>{l.type === 'image' ? `Картинка ${i + 1}` : l.text || 'Текст'}</span>
                    <span
                      className="constructor__layer-remove"
                      role="button"
                      tabIndex={0}
                      aria-label="Удалить слой"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLayer(l.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.stopPropagation();
                          removeLayer(l.id);
                        }
                      }}
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedLayer && (
            <div className="constructor__section">
              <span className="constructor__label">Настройки слоя</span>
              <div className="constructor__upload">
                {selectedLayer.type === 'text' && (
                  <>
                    <input
                      type="text"
                      maxLength={24}
                      placeholder="Текст"
                      value={selectedLayer.text}
                      onChange={(e) => patchLayer(selectedLayer.id, { text: e.target.value })}
                      className="constructor__input"
                    />
                    <div className="constructor__row">
                      <div className="constructor__fonts">
                        {FONTS.map((f) => (
                          <button
                            key={f.id}
                            className={selectedLayer.font === f.id ? 'is-active' : ''}
                            onClick={() => patchLayer(selectedLayer.id, { font: f.id })}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                      <input
                        type="color"
                        value={selectedLayer.color}
                        onChange={(e) => patchLayer(selectedLayer.id, { color: e.target.value })}
                        className="constructor__colorpick"
                        aria-label="Цвет текста"
                      />
                    </div>
                  </>
                )}

                <div className="constructor__slider">
                  <span>Размер</span>
                  <input
                    type="range"
                    min="0.4"
                    max="1.8"
                    step="0.02"
                    value={selectedLayer.scale}
                    onChange={(e) => patchLayer(selectedLayer.id, { scale: Number(e.target.value) })}
                  />
                </div>
                <div className="constructor__slider">
                  <span>Поворот</span>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    step="1"
                    value={selectedLayer.rotation}
                    onChange={(e) => patchLayer(selectedLayer.id, { rotation: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="constructor__section">
            <span className="constructor__label">Модель</span>
            <div className="constructor__models">
              {PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  className={`constructor__model ${p.id === baseProduct.id ? 'is-active' : ''}`}
                  onClick={() => navigate(`/constructor/${p.id}`)}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="constructor__section">
            <span className="constructor__label">Цвет футболки</span>
            <div className="constructor__colors">
              {GARMENT_COLORS.filter((c) => baseProduct.colors.includes(c.id)).map((c) => (
                <button
                  key={c.id}
                  className={`constructor__swatch ${color === c.id ? 'is-active' : ''}`}
                  style={{ background: c.hex }}
                  onClick={() => setColor(c.id)}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="constructor__section">
            <span className="constructor__label">Размер</span>
            <div className="constructor__sizes">
              {SIZES.map((s) => (
                <button key={s} className={size === s ? 'is-active' : ''} onClick={() => setSize(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="constructor__footer">
            <div className="constructor__price">
              <span>Итого</span>
              <strong>{price.toLocaleString('ru-RU')} ₽</strong>
            </div>
            <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
              {added ? 'Добавлено ✓' : 'Добавить в корзину'}
            </button>
          </div>
          {added && (
            <button className="constructor__gocart" onClick={() => navigate('/cart')}>
              Перейти в корзину →
            </button>
          )}
          {saveError && (
            <p className="constructor__error">
              Не удалось сохранить корзину — в браузере закончилось место для хранения. Освободите его или уменьшите число товаров с принтом.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
