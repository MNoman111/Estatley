import { useMemo, useState } from 'react';
import { formatPrice } from '../utils/format.js';

const Slider = ({ label, value, suffix, min, max, step, onChange }) => (
  <div className="filter-group" style={{ marginBottom: 14 }}>
    <label style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>{label}</span><span style={{ color: 'var(--brand)' }}>{value}{suffix}</span>
    </label>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--brand)' }} />
  </div>
);

// Simple mortgage / instalment estimator for a property price (PKR).
export default function MortgageCalc({ price }) {
  const [downPct, setDownPct] = useState(20);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(18); // annual % — typical PK home-finance rate

  const { monthly, financed } = useMemo(() => {
    const principal = Math.max(0, price - (price * downPct) / 100);
    const r = rate / 100 / 12;
    const n = years * 12;
    const m = r === 0 ? principal / n : (principal * r) / (1 - Math.pow(1 + r, -n));
    return { monthly: Math.round(m), financed: principal };
  }, [price, downPct, years, rate]);

  return (
    <div className="panel" style={{ marginTop: 20 }}>
      <h3>💰 Instalment Estimator</h3>
      <p style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 16 }}>
        Estimate your monthly payment. Indicative only — not a financial offer.
      </p>
      <Slider label="Down payment" value={downPct} suffix="%" min={0} max={80} step={5} onChange={setDownPct} />
      <Slider label="Tenure" value={years} suffix=" yrs" min={1} max={25} step={1} onChange={setYears} />
      <Slider label="Interest rate" value={rate} suffix="%" min={0} max={40} step={0.5} onChange={setRate} />
      <div style={{ background: 'var(--brand-soft)', borderRadius: 12, padding: '16px 18px', marginTop: 6, textAlign: 'center' }}>
        <div style={{ color: 'var(--muted)', fontSize: 13 }}>Estimated monthly payment</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--brand)', fontFamily: "'Plus Jakarta Sans'" }}>
          {formatPrice(monthly)}<span style={{ fontSize: 14, fontWeight: 500 }}> /mo</span>
        </div>
        <div style={{ color: 'var(--muted)', fontSize: 12.5, marginTop: 4 }}>Financed amount: {formatPrice(financed)}</div>
      </div>
    </div>
  );
}
