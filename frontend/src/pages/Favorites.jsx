import { useEffect, useState } from 'react';
import client from '../api/client.js';
import PropertyCard from '../components/PropertyCard.jsx';

export default function Favorites() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/users/me/favorites')
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container section">
      <h2>Saved Properties</h2>
      <div className="sub">Properties you've bookmarked</div>
      {loading ? (
        <div className="spinner">Loading…</div>
      ) : items.length === 0 ? (
        <div className="center-empty">You haven't saved any properties yet. Tap the ♡ on any listing.</div>
      ) : (
        <div className="grid">{items.map((p) => <PropertyCard key={p._id} property={p} />)}</div>
      )}
    </div>
  );
}
