let _uid = 0;

// Nestaro logo mark (Option B): a clean tile with a gradient "N" monogram + gold dot.
export default function LogoMark({ size = 34 }) {
  const id = `nm${++_uid}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flex: 'none' }}>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0f766e" />
          <stop offset="0.55" stopColor="#14b8a6" />
          <stop offset="1" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id={`${id}gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="96" height="96" rx="28" fill="#ffffff" stroke={`url(#${id}g)`} strokeWidth="4" />
      <path d="M30 76 V32 L70 76 V32" fill="none" stroke={`url(#${id}g)`} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="74" cy="28" r="9" fill={`url(#${id}gold)`} />
    </svg>
  );
}
