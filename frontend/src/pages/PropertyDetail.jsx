import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatPrice } from '../utils/format.js';

export default function PropertyDetail() {
  const { id } = useParams();
  const { user, toggleFavorite } = useAuth();
  const [p, setP] = useState(null);
  const [active, setActive] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    client.get(`/properties/${id}`)
      .then((res) => setP(res.data))
      .catch(() => setError('Property not found.'));
  }, [id]);

  if (error) return <div className="center-empty">{error}</div>;
  if (!p) return <div className="spinner">Loading…</div>;

  const isFav = user?.favorites?.some((f) => (f._id || f) === p._id);
  const imgs = p.images?.length ? p.images : ['https://via.placeholder.com/800x600?text=No+Image'];

  return (
    <div className="container detail">
      <div style={{ marginBottom: 14, color: 'var(--muted)', fontSize: 14 }}>
        <Link to="/properties" className="muted-link">← Back to listings</Link>
      </div>

      <div className="gallery">
        <div className="main"><img src={imgs[active]} alt={p.title} /></div>
        <div className="side">
          {imgs.slice(1, 3).map((src, i) => (
            <img key={i} src={src} alt="" onClick={() => setActive(i + 1)} style={{ cursor: 'pointer' }} />
          ))}
        </div>
      </div>
      {imgs.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          {imgs.map((src, i) => (
            <img key={i} src={src} alt="" onClick={() => setActive(i)}
              style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6, cursor: 'pointer', border: i === active ? '2px solid var(--green)' : '2px solid transparent' }} />
          ))}
        </div>
      )}

      <div className="detail-grid">
        <div>
          <span className={`badge ${p.purpose}`} style={{ position: 'static', display: 'inline-block', marginBottom: 10 }}>For {p.purpose}</span>
          <h1>{p.title}</h1>
          <div className="loc" style={{ color: 'var(--muted)' }}>📍 {p.address || `${p.location}, ${p.city}`}</div>
          <div className="price-lg">{formatPrice(p.price)}</div>

          <div className="kv">
            <div className="item"><div className="k">Type</div><div className="v">{p.type}</div></div>
            <div className="item"><div className="k">Area</div><div className="v">{p.area} {p.areaUnit}</div></div>
            {p.bedrooms > 0 && <div className="item"><div className="k">Bedrooms</div><div className="v">{p.bedrooms}</div></div>}
            {p.bathrooms > 0 && <div className="item"><div className="k">Bathrooms</div><div className="v">{p.bathrooms}</div></div>}
          </div>

          <div className="panel" style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 10 }}>Description</h3>
            <p style={{ color: '#374151' }}>{p.description}</p>
          </div>

          {p.amenities?.length > 0 && (
            <div className="panel">
              <h3 style={{ marginBottom: 12 }}>Amenities</h3>
              <div className="amenities">
                {p.amenities.map((a) => <span key={a} className="chip">{a}</span>)}
              </div>
            </div>
          )}
        </div>

        <aside>
          <div className="panel agent-card" style={{ marginBottom: 16 }}>
            {p.agent ? (
              <>
                <img src={p.agent.avatar} alt={p.agent.name} />
                <div style={{ fontWeight: 700 }}>{p.agent.name}</div>
                <div style={{ color: 'var(--muted)', fontSize: 14 }}>{p.agent.agency}</div>
                <div style={{ margin: '14px 0', fontSize: 14 }}>📞 {p.agent.phone}</div>
                <a href={`tel:${p.agent.phone}`} className="btn btn-block">Call Agent</a>
                <a href={`mailto:${p.agent.email}`} className="btn btn-outline btn-block" style={{ marginTop: 8 }}>Email</a>
                <Link to={`/agents/${p.agent._id}`} className="muted-link" style={{ display: 'inline-block', marginTop: 12, fontSize: 14 }}>View profile</Link>
              </>
            ) : <div>Agent info unavailable</div>}
          </div>
          <button className={`btn btn-block ${isFav ? 'btn-orange' : 'btn-outline'}`}
            onClick={() => (user ? toggleFavorite(p._id) : alert('Please log in to save.'))}>
            {isFav ? '♥ Saved' : '♡ Save Property'}
          </button>
        </aside>
      </div>
    </div>
  );
}
