import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatPrice } from '../utils/format.js';

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('listings');
  const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [profile, setProfile] = useState({ name: '', phone: '', agency: '', about: '' });
  const [msg, setMsg] = useState('');

  const isAgent = user.role === 'agent' || user.role === 'admin';

  useEffect(() => {
    setProfile({ name: user.name, phone: user.phone, agency: user.agency, about: user.about });
    if (isAgent) client.get('/users/me/listings').then((r) => setListings(r.data));
    client.get('/users/me/favorites').then((r) => setFavorites(r.data));
  }, [user]);

  const del = async (id) => {
    if (!confirm('Delete this listing?')) return;
    await client.delete(`/properties/${id}`);
    setListings((l) => l.filter((p) => p._id !== id));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    await client.put('/users/profile', profile);
    await refreshUser();
    setMsg('Profile updated successfully.');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="container">
      <div className="dash-head">
        <div>
          <h2>Hi, {user.name.split(' ')[0]} 👋</h2>
          <div className="sub">{isAgent ? 'Manage your listings and profile' : 'Your saved properties and profile'}</div>
        </div>
        {isAgent && <Link to="/post" className="btn btn-orange">+ Post New Property</Link>}
      </div>

      <div className="tabs-bar">
        {isAgent && <button className={tab === 'listings' ? 'active' : ''} onClick={() => setTab('listings')}>My Listings ({listings.length})</button>}
        <button className={tab === 'favorites' ? 'active' : ''} onClick={() => setTab('favorites')}>Saved ({favorites.length})</button>
        <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}>Profile</button>
      </div>

      {tab === 'listings' && isAgent && (
        <div>
          {listings.length === 0 ? (
            <div className="center-empty">No listings yet. <Link to="/post" className="muted-link">Post your first property</Link>.</div>
          ) : listings.map((p) => (
            <div className="list-row" key={p._id}>
              <img src={p.images?.[0]} alt="" />
              <div className="info">
                <div style={{ fontWeight: 600 }}>{p.title}</div>
                <div style={{ color: 'var(--muted)', fontSize: 14 }}>{p.location}, {p.city}</div>
                <div style={{ color: 'var(--green)', fontWeight: 700 }}>{formatPrice(p.price)}</div>
              </div>
              <div className="actions">
                <button className="btn btn-outline btn-sm" onClick={() => navigate(`/post/${p._id}`)}>Edit</button>
                <button className="btn btn-sm" style={{ background: '#e11d48' }} onClick={() => del(p._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'favorites' && (
        <div>
          {favorites.length === 0 ? (
            <div className="center-empty">No saved properties yet.</div>
          ) : favorites.map((p) => (
            <div className="list-row" key={p._id}>
              <img src={p.images?.[0]} alt="" />
              <div className="info">
                <div style={{ fontWeight: 600 }}>{p.title}</div>
                <div style={{ color: 'var(--muted)', fontSize: 14 }}>{p.location}, {p.city}</div>
                <div style={{ color: 'var(--green)', fontWeight: 700 }}>{formatPrice(p.price)}</div>
              </div>
              <Link to={`/properties/${p._id}`} className="btn btn-outline btn-sm">View</Link>
            </div>
          ))}
        </div>
      )}

      {tab === 'profile' && (
        <div className="auth-wrap" style={{ margin: '0 0 40px', maxWidth: 540 }}>
          {msg && <div className="alert success">{msg}</div>}
          <form onSubmit={saveProfile}>
            <div className="field"><label>Name</label><input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
            <div className="field"><label>Phone</label><input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
            {isAgent && <div className="field"><label>Agency</label><input value={profile.agency} onChange={(e) => setProfile({ ...profile, agency: e.target.value })} /></div>}
            {isAgent && <div className="field"><label>About</label><textarea value={profile.about} onChange={(e) => setProfile({ ...profile, about: e.target.value })} /></div>}
            <button className="btn">Save Changes</button>
          </form>
        </div>
      )}
    </div>
  );
}
