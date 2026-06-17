import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import client from '../api/client.js';
import PropertyCard from '../components/PropertyCard.jsx';

export default function AgentProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    client.get(`/users/${id}`)
      .then((res) => setData(res.data))
      .catch(() => setError('Profile not found.'));
  }, [id]);

  if (error) return <div className="center-empty">{error}</div>;
  if (!data) return <div className="spinner">Loading…</div>;

  const { user, listings } = data;

  return (
    <div className="container section">
      <div className="panel" style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 28 }}>
        <img src={user.avatar} alt={user.name} style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover' }} />
        <div>
          <h2 style={{ marginBottom: 4 }}>{user.name}</h2>
          {user.agency && <div style={{ color: 'var(--green)', fontWeight: 600 }}>{user.agency}</div>}
          <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>
            {user.phone && <>📞 {user.phone} &nbsp;</>}✉️ {user.email}
          </div>
          {user.about && <p style={{ marginTop: 10, maxWidth: 600, color: '#374151' }}>{user.about}</p>}
        </div>
      </div>

      <h3 style={{ marginBottom: 16 }}>Listings by {user.name.split(' ')[0]} ({listings.length})</h3>
      {listings.length === 0 ? (
        <div className="center-empty">No active listings.</div>
      ) : (
        <div className="grid">{listings.map((p) => <PropertyCard key={p._id} property={p} />)}</div>
      )}
    </div>
  );
}
