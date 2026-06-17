import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../api/client.js';
import { cities, types } from '../utils/format.js';

const empty = {
  title: '', purpose: 'sale', type: 'House', price: '', city: 'Lahore', location: '',
  address: '', area: '', areaUnit: 'Marla', bedrooms: '', bathrooms: '',
  description: '', images: '', amenities: '', featured: false,
};

export default function PostProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    client.get(`/properties/${id}`).then((r) => {
      const p = r.data;
      setForm({
        ...p,
        images: (p.images || []).join('\n'),
        amenities: (p.amenities || []).join(', '),
      });
    });
  }, [id]);

  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const fallbackImg = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80';

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    const images = form.images.split('\n').map((s) => s.trim()).filter(Boolean);
    const payload = {
      ...form,
      price: Number(form.price),
      area: Number(form.area),
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      images: images.length ? images : [fallbackImg],
      amenities: form.amenities.split(',').map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (id) await client.put(`/properties/${id}`, payload);
      else await client.post('/properties', payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally { setBusy(false); }
  };

  return (
    <div className="container section" style={{ maxWidth: 760 }}>
      <h2>{id ? 'Edit Property' : 'Post a New Property'}</h2>
      <div className="sub">Fill in the details below to {id ? 'update your' : 'list a'} property.</div>
      {error && <div className="alert">{error}</div>}
      <form onSubmit={submit} className="panel">
        <div className="field"><label>Title *</label><input required value={form.title} onChange={upd('title')} placeholder="e.g. 10 Marla House in DHA" /></div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="field"><label>Purpose</label>
            <select value={form.purpose} onChange={upd('purpose')}><option value="sale">For Sale</option><option value="rent">For Rent</option></select>
          </div>
          <div className="field"><label>Type</label>
            <select value={form.type} onChange={upd('type')}>{types.map((t) => <option key={t}>{t}</option>)}</select>
          </div>
          <div className="field"><label>Price (PKR) *</label><input type="number" required value={form.price} onChange={upd('price')} /></div>
          <div className="field"><label>City</label><select value={form.city} onChange={upd('city')}>{cities.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div className="field"><label>Location / Society *</label><input required value={form.location} onChange={upd('location')} placeholder="e.g. DHA Phase 6" /></div>
          <div className="field"><label>Full Address</label><input value={form.address} onChange={upd('address')} /></div>
          <div className="field"><label>Area *</label><input type="number" required value={form.area} onChange={upd('area')} /></div>
          <div className="field"><label>Area Unit</label>
            <select value={form.areaUnit} onChange={upd('areaUnit')}>{['Marla', 'Kanal', 'Sq. Ft.', 'Sq. Yd.'].map((u) => <option key={u}>{u}</option>)}</select>
          </div>
          <div className="field"><label>Bedrooms</label><input type="number" value={form.bedrooms} onChange={upd('bedrooms')} /></div>
          <div className="field"><label>Bathrooms</label><input type="number" value={form.bathrooms} onChange={upd('bathrooms')} /></div>
        </div>

        <div className="field"><label>Description</label><textarea value={form.description} onChange={upd('description')} /></div>
        <div className="field"><label>Image URLs (one per line)</label>
          <textarea value={form.images} onChange={upd('images')} placeholder={`Leave blank to use a default image\n${fallbackImg}`} />
        </div>
        <div className="field"><label>Amenities (comma separated)</label><input value={form.amenities} onChange={upd('amenities')} placeholder="Parking, Lawn, Security" /></div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginBottom: 16 }}>
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Mark as featured
        </label>
        <button className="btn btn-block" disabled={busy}>{busy ? 'Saving…' : id ? 'Update Property' : 'Publish Property'}</button>
      </form>
    </div>
  );
}
