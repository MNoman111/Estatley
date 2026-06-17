import useReveal from '../hooks/useReveal.js';

// Wrapper that fades + slides its children in on scroll.
export default function Reveal({ children, className = '', style }) {
  const [ref, shown] = useReveal();
  return (
    <div ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`} style={style}>
      {children}
    </div>
  );
}
