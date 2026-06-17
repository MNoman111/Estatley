import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client.js';
import PropertyCard from '../components/PropertyCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { cities, types } from '../utils/format.js';

const cityImages = {
  Lahore: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=600&q=80',
  Karachi: 'https://images.unsplash.com/photo-1610016302534-6f67f1c968d8?auto=format&fit=crop&w=600&q=80',
  Islamabad: 'https://images.unsplash.com/photo-1599930113854-d6d7fd521f10?auto=format&fit=crop&w=600&q=80',
  Rawalpindi: 'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?auto=format&fit=crop&w=600&q=80',
};

const featuresList = [
  { ic: '🔍', t: 'Smart Search', d: 'Filter by city, price, type and beds to find your perfect match in seconds.' },
  { ic: '🛡️', t: 'Verified Listings', d: 'Every property is reviewed so you only see genuine, up-to-date listings.' },
  { ic: '🤝', t: 'Trusted Agents', d: 'Connect directly with experienced agents across all major cities.' },
  { ic: '💸', t: 'Best Value', d: 'Transparent pricing in PKR with no hidden fees, for sale and rent.' },
];

const testimonials = [
  { name: 'Sara Ahmed', role: 'Bought in DHA Lahore', text: 'Found our family home within a week. The filters made it so easy to compare options!', img: 'https://i.pravatar.cc/100?img=47' },
  { name: 'Usman Tariq', role: 'Rented in Islamabad', text: 'Clean interface and the agent contact was instant. Highly recommend Estatley.', img: 'https://i.pravatar.cc/100?img=12' },
  { name: 'Hina Raza', role: 'Sold in Karachi', text: 'Listed my apartment and got serious inquiries the same day. Smooth experience.', img: 'https://i.pravatar.cc/100?img=32' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purpose, setPurpose] = useState('sale');
  const [q, setQ] = useState('');
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    client.get('/properties', { params: { featured: true, limit: 6 } })
      .then((res) => setFeatured(res.data.items))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const search = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('purpose', purpose);
    if (q) params.set('q', q);
    if (city) params.set('city', city);
    if (type) params.set('type', type);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <span className="eyebrow">🏆 Pakistan's modern property marketplace</span>
          <h1>Find a place you'll<br /><span className="accent">love to call home</span></h1>
          <p>Browse thousands of houses, flats, plots and commercial properties for sale and rent.</p>
          <form className="searchbar" onSubmit={search}>
            <div className="tabs">
              <button type="button" className={purpose === 'sale' ? 'active' : ''} onClick={() => setPurpose('sale')}>Buy</button>
              <button type="button" className={purpose === 'rent' ? 'active' : ''} onClick={() => setPurpose('rent')}>Rent</button>
            </div>
            <input placeholder="Search by location or keyword…" value={q} onChange={(e) => setQ(e.target.value)} />
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">All Cities</option>
              {cities.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">All Types</option>
              {types.map((t) => <option key={t}>{t}</option>)}
            </select>
            <button className="btn" type="submit">🔍 Search</button>
          </form>
        </div>
      </section>

      <div className="container">
        <div className="stats">
          {[['20+', 'Active Listings'], ['4', 'Major Cities'], ['3', 'Expert Agents'], ['100%', 'Verified']].map(([n, l]) => (
            <div className="stat" key={l}>
              <div className="num">{n}</div>
              <div className="lbl">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="section container">
        <Reveal>
          <div className="section-head">
            <div>
              <div className="eyebrow-line">Handpicked</div>
              <h2>Featured Properties</h2>
              <div className="sub">Premium listings from our top agents</div>
            </div>
            <Link to="/properties" className="btn btn-outline btn-sm">View all →</Link>
          </div>
        </Reveal>
        <div className="grid">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div className="skeleton" key={i}>
                  <div className="sk-img" />
                  <div className="sk-line" /><div className="sk-line short" />
                </div>
              ))
            : featured.map((p) => <PropertyCard key={p._id} property={p} />)}
        </div>
      </section>

      <section className="section container">
        <Reveal>
          <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 36px' }}>
            <div className="eyebrow-line">Why Estatley</div>
            <h2>Everything you need to move with confidence</h2>
          </div>
        </Reveal>
        <div className="features">
          {featuresList.map((f) => (
            <Reveal key={f.t}>
              <div className="feature">
                <div className="ic">{f.ic}</div>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section container">
        <Reveal>
          <div className="section-head">
            <div>
              <div className="eyebrow-line">Explore</div>
              <h2>Browse by City</h2>
              <div className="sub">Discover properties in Pakistan's major cities</div>
            </div>
          </div>
        </Reveal>
        <div className="cities">
          {cities.map((c) => (
            <Link key={c} to={`/properties?city=${c}`} className="city-card">
              <img src={cityImages[c]} alt={c} loading="lazy" />
              <span className="city-name">{c}</span>
              <span className="city-count">View listings →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container">
        <Reveal>
          <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 36px' }}>
            <div className="eyebrow-line">Testimonials</div>
            <h2>Loved by buyers, renters & sellers</h2>
          </div>
        </Reveal>
        <div className="testimonials">
          {testimonials.map((t) => (
            <Reveal key={t.name}>
              <div className="tcard">
                <div className="stars">★★★★★</div>
                <p>"{t.text}"</p>
                <div className="who">
                  <img src={t.img} alt={t.name} loading="lazy" />
                  <div>
                    <div className="name">{t.name}</div>
                    <div className="role">{t.role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section container">
        <Reveal>
          <div className="cta-band">
            <h2>Ready to list your property?</h2>
            <p>Reach thousands of buyers and renters. Posting takes less than two minutes.</p>
            <Link to="/register" className="btn">Get started — it's free</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
