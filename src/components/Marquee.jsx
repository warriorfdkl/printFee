import './Marquee.css';

export default function Marquee({ text, speed = 28, dark = false }) {
  return (
    <div className={`marquee ${dark ? 'marquee--dark' : ''}`}>
      <div className="marquee__track" style={{ animationDuration: `${speed}s` }}>
        {[0, 1].map((i) => (
          <div className="marquee__group" key={i}>
            {Array.from({ length: 6 }).map((_, j) => (
              <span key={j} className="marquee__item">
                {text}
                <i className="marquee__dot" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
