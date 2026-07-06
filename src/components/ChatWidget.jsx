import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GREETING, QUICK_REPLIES, FALLBACK_REPLY } from '../data/chatbot';
import './ChatWidget.css';

let uid = 0;
const nextId = () => `m${Date.now()}-${uid++}`;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const [seen, setSeen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setTyping(true);
      const t = setTimeout(() => {
        setTyping(false);
        setMessages([{ id: nextId(), from: 'bot', text: GREETING }]);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [open, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const respond = (text) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { id: nextId(), from: 'bot', text }]);
    }, 700 + Math.random() * 500);
  };

  const sendQuickReply = (qr) => {
    setMessages((m) => [...m, { id: nextId(), from: 'user', text: qr.label }]);
    respond(qr.reply);
  };

  const sendCustom = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { id: nextId(), from: 'user', text }]);
    setInput('');
    respond(FALLBACK_REPLY);
  };

  const toggle = () => {
    setOpen((v) => !v);
    setSeen(true);
  };

  return (
    <div className="chat-widget">
      <AnimatePresence>
        {open && (
          <motion.div
            className="chat-widget__panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="chat-widget__header">
              <div>
                <strong>PrintFee bot</strong>
                <span>обычно отвечает за пару минут</span>
              </div>
              <button className="chat-widget__close" onClick={toggle} aria-label="Закрыть чат">
                ×
              </button>
            </div>

            <div className="chat-widget__body" ref={scrollRef}>
              {messages.map((m) => (
                <div key={m.id} className={`chat-widget__bubble chat-widget__bubble--${m.from}`}>
                  {m.text}
                </div>
              ))}
              {typing && (
                <div className="chat-widget__bubble chat-widget__bubble--bot chat-widget__typing">
                  <span />
                  <span />
                  <span />
                </div>
              )}
              {!typing && messages.length > 0 && (
                <div className="chat-widget__quick">
                  {QUICK_REPLIES.map((qr) => (
                    <button key={qr.id} onClick={() => sendQuickReply(qr)}>
                      {qr.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form className="chat-widget__input" onSubmit={sendCustom}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Напишите вопрос…"
              />
              <button type="submit" aria-label="Отправить">
                →
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button className="chat-widget__fab" onClick={toggle} aria-label="Открыть чат">
        {!seen && <span className="chat-widget__dot" />}
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              ×
            </motion.span>
          ) : (
            <motion.svg
              key="chat"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 3C6.98 3 3 6.58 3 11c0 2.42 1.2 4.6 3.1 6.08-.1 1.14-.46 2.36-1.28 3.4a.4.4 0 00.42.64c1.8-.42 3.16-1.24 4.02-1.86.87.18 1.78.28 2.74.28 5.02 0 9-3.58 9-8s-3.98-8-9-8Z"
                fill="currentColor"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
