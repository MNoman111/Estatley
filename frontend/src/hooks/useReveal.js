import { useEffect, useRef, useState } from 'react';

// Adds an `in` class when the element scrolls into view (one-shot).
export default function useReveal(options = { threshold: 0.12 }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShown(true);
        obs.disconnect();
      }
    }, options);
    obs.observe(el);
    return () => obs.disconnect();
  }, [shown, options]);

  return [ref, shown];
}
