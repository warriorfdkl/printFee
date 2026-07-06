import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoMark from '../assets/logo/mark.svg';
import './Loader.css';

const SESSION_KEY = 'pp_visited';
const MIN_DURATION = 1900;

export default function Loader() {
  const [visible, setVisible] = useState(() => {
    try {
      return !sessionStorage.getItem(SESSION_KEY);
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = '';
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* ignore privacy-mode errors */
      }
    }, MIN_DURATION);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.img
            src={logoMark}
            alt="PrintFee"
            className="loader__mark"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: [0, 1, 0.7, 1], scale: [0.85, 1, 1.06, 1] }}
            transition={{ duration: 2.2, times: [0, 0.25, 0.6, 1], repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
