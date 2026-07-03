import './TShirt.css';

export const PRINT_ZONE = { left: 35.5, top: 34, width: 29, height: 34 };

const SHIRT_PATH =
  'M100,112 L38,152 L14,94 L72,24 C96,8 128,20 148,26 C162,46 182,57 200,57 C218,57 238,46 252,26 C272,20 304,8 328,24 L386,94 L362,152 L300,112 L300,432 L100,432 Z';

export default function TShirt({ color = '#f7f6f2', outline = '#0a0a0a', className = '', children }) {
  return (
    <div className={`tshirt ${className}`}>
      <svg viewBox="0 0 400 460" className="tshirt__svg" xmlns="http://www.w3.org/2000/svg">
        <path d={SHIRT_PATH} fill={color} stroke={outline} strokeWidth="3" strokeLinejoin="round" />
        <path
          d="M162,30 C172,53 185,65 200,65 C215,65 228,53 238,30"
          fill="none"
          stroke={outline}
          strokeWidth="2"
          opacity="0.3"
        />
        <line x1="100" y1="140" x2="100" y2="420" stroke={outline} strokeWidth="1" opacity="0.15" />
        <line x1="300" y1="140" x2="300" y2="420" stroke={outline} strokeWidth="1" opacity="0.15" />
      </svg>
      {children}
    </div>
  );
}
