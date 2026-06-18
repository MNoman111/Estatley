import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatPrice } from '../utils/format.js';
import { addRecent } from '../utils/recentlyViewed.js';
import MortgageCalc from '../components/MortgageCalc.jsx';
import PropertyCard from '../components/PropertyCard.jsx';

export default function PropertyDetail() {
  const { id } = useParams();
  const { user, toggleFavorite } = useAuth();
  const toast = useToast();
  const [p, setP] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [error, setError] = useState('');
  const [lightbox, setLightbox] = useState(null); // index or null

  useEffect(() => {
    setP(null);
    setError('');
    client.get(`/properties/${id}`)
      .then((res) => {
        setP(res.data);
        addRecent(res.data);
        return client.get('/properties', { params: { city: res.data.city, purpose: res.data.purpose, limit: 7 } });
      })
      .then((res) => res && setSimilar(res.data.items.filter((x) => x._id !== id).slice(0, 3)))
      .catch(() => setError('Property not found.'));
  }, [id]);

  useEffect(() => {
    if (lightbox === null || !p) return;
    const imgs = p.images?.length ? p.images : [];
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox((i) => (i + 1) % imgs.length);
      if (e.key === 'ArrowLeft') setLightbox((i) => (i - 1 + imgs.length) % imgs.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, p]);

  if (error) return <div className="center-empty">{error}</div>;
  if (!p) return <div className="spinner">Loading property…</div>;

  const isFav = user?.favorites?.some((f) => (f._id || f) === p._id);
  const imgs = p.images?.length ? p.images : ['https://via.placeholder.com/800x600?text=No+Image'];

  const handleFav = async () => {
    if (!user) return toast('Please log in to save properties');
    const fav = await toggleFavorite(p._id);
    toast(fav ? '❤️ Saved to favorites' : 'Removed from favorites');
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: p.title, text: `${p.title} — ${formatPrice(p.price)}`, url });
      else { await navigator.clipboard.writeText(url); toast('🔗 Link copied to clipboard'); }
    } catch { /* user cancelled share */ }
  };

  const waLink = p.agent?.phone
    ? `https://wa.me/${p.agent.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in "${p.title}" (${formatPrice(p.price)}) listed on Nestaro.`)}`
    : null;

  return (
    <div className="container detail">
      <div className="breadcrumb" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/properties" className="muted-link">← Back to listings</Link>
        <button className="btn btn-outline btn-sm" onClick={handleShare}>🔗 Share</button>
      </div>

      <div className="gallery">
        <div className="main" onClick={() => setLightbox(0)}>
          <img src={imgs[0]} alt={p.title} />
        </div>
        <div className="side">
          {imgs.slice(1, 3).map((src, i) => (
            <div className="gi" key={i} onClick={() => setLightbox(i + 1)}>
              <img src={src} alt="" />
              {i === 1 && imgs.length > 3 && <div className="more">+{imgs.length - 3} more</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="detail-grid">
        <div>
          <span className={`badge ${p.purpose}`} style={{ position: 'static', display: 'inline-block', marginBottom: 12 }}>For {p.purpose}</span>
          <h1>{p.title}</h1>
          <div className="loc" style={{ color: 'var(--muted)' }}>📍 {p.address || `${p.location}, ${p.city}`}</div>
          <div className="price-lg">{formatPrice(p.price)}</div>

          <div className="kv">
            <div className="item"><div className="ic">🏠</div><div className="k">Type</div><div className="v">{p.type}</div></div>
            <div className="item"><div className="ic">📐</div><div className="k">Area</div><div className="v">{p.area} {p.areaUnit}</div></div>
            {p.bedrooms > 0 && <div className="item"><div className="ic">🛏</div><div className="k">Bedrooms</div><div className="v">{p.bedrooms}</div></div>}
            {p.bathrooms > 0 && <div className="item"><div className="ic">🛁</div><div className="k">Bathrooms</div><div className="v">{p.bathrooms}</div></div>}
          </div>

          <div className="panel" style={{ marginBottom: 20 }}>
            <h3>Description</h3>
            <p style={{ color: 'var(--ink)' }}>{p.description}</p>
          </div>

          {p.amenities?.length > 0 && (
            <div className="panel">
              <h3>Amenities</h3>
              <div className="amenities">
                {p.amenities.map((a) => <span key={a} className="chip">✓ {a}</span>)}
              </div>
            </div>
          )}
        </div>

        <aside>
          <div className="panel agent-card">
            {p.agent ? (
              <>
                <img className="ava" src={p.agent.avatar} alt={p.agent.name} />
                <div style={{ fontWeight: 700, fontSize: 17 }}>{p.agent.name}</div>
                <div style={{ color: 'var(--brand)', fontSize: 14, fontWeight: 600 }}>{p.agent.agency}</div>
                <div style={{ margin: '14px 0', fontSize: 14, color: 'var(--muted)' }}>📞 {p.agent.phone}</div>
                <a href={`tel:${p.agent.phone}`} className="btn btn-block">Call Agent</a>
                {waLink && <a href={waLink} target="_blank" rel="noreferrer" className="btn btn-block" style={{ marginTop: 10, background: '#25D366', boxShadow: 'none' }}>💬 WhatsApp</a>}
                <a href={`mailto:${p.agent.email}`} className="btn btn-outline btn-block" style={{ marginTop: 10 }}>✉️ Email</a>
                <button className={`btn btn-block ${isFav ? 'btn-orange' : 'btn-outline'}`} style={{ marginTop: 10 }} onClick={handleFav}>
                  {isFav ? '♥ Saved' : '♡ Save Property'}
                </button>
                <Link to={`/agents/${p.agent._id}`} className="muted-link" style={{ display: 'inline-block', marginTop: 14, fontSize: 14 }}>View agent profile →</Link>
              </>
            ) : <div>Agent info unavailable</div>}
          </div>

          {p.purpose === 'sale' && <MortgageCalc price={p.price} />}
        </aside>
      </div>

      {similar.length > 0 && (
        <section style={{ marginTop: 50 }}>
          <h2 style={{ marginBottom: 6 }}>Similar Properties</h2>
          <div className="sub" style={{ color: 'var(--muted)', marginBottom: 22 }}>More in {p.city} for {p.purpose}</div>
          <div className="grid">
            {similar.map((s) => <PropertyCard key={s._id} property={s} />)}
          </div>
        </section>
      )}

      {lightbox !== null && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lb-close" onClick={() => setLightbox(null)}>×</button>
          {imgs.length > 1 && (
            <button className="lb-nav prev" onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i - 1 + imgs.length) % imgs.length); }}>‹</button>
          )}
          <img src={imgs[lightbox]} alt="" onClick={(e) => e.stopPropagation()} />
          {imgs.length > 1 && (
            <button className="lb-nav next" onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i + 1) % imgs.length); }}>›</button>
          )}
        </div>
      )}
    </div>
  );
}
