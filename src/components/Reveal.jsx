import { motion } from 'framer-motion';

export default function Reveal({
  children,
  delay = 0,
  y = 40,
  once = true,
  amount = 0.3,
  className = '',
  as = 'div',
}) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Comp>
  );
}
