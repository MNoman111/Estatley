import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client.js';
import PropertyCard from '../components/PropertyCard.jsx';
import { cities, types } from '../utils/format.js';

const cityImages = {
  Lahore: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=600&q=80',
  Karachi: 'https://images.unsplash.com/photo-1610016302534-6f67f1c968d8?auto=format&fit=crop&w=600&q=80',
  Islamabad: 'https://images.unsplash.com/photo-1599930113854-d6d7fd521f10?auto=format&fit=crop&w=600&q=80',
  Rawalpindi: 'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?auto=format&fit=crop&w=600&q=80',
};

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [purpose, setPurpose] = useState('sale');
  const [q, setQ] = useState('');
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    client.get('/properties', { params: { featured: true, limit: 6 } })
      .then((res) => setFeatured(res.data.items))
      .catch(() => {});
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
        <div className="container">
          <h1>Find Your Dream Property in Pakistan</h1>
          <p>Search from thousands of houses, flats, plots and commercial properties.</p>
          <form className="searchbar" onSubmit={search}>
            <div className="tabs">
              <button type="button" className={purpose === 'sale' ? 'active' : ''} onClick={() => setPurpose('sale')}>Buy</button>
              <button type="button" className={purpose === 'rent' ? 'active' : ''} onClick={() => setPurpose('rent')}>Rent</button>
            </div>
            <input placeholder="Search by location, title…" value={q} onChange={(e) => setQ(e.target.value)} />
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

      <section className="section container">
        <div className="section-head">
          <div>
            <h2>Featured Properties</h2>
            <div className="sub">Handpicked listings from top agents</div>
          </div>
          <Link to="/properties" className="btn btn-outline btn-sm">View all</Link>
        </div>
        <div className="grid">
          {featured.map((p) => <PropertyCard key={p._id} property={p} />)}
        </div>
      </section>

      <section className="section container">
        <h2>Browse by City</h2>
        <div className="sub">Explore properties in Pakistan's major cities</div>
        <div className="cities">
          {cities.map((c) => (
            <Link key={c} to={`/properties?city=${c}`} className="city-card" style={{ backgroundImage: `url(${cityImages[c]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <span>{c}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
