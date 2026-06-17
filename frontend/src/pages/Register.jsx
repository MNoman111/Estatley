import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'user', agency: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setBusy(false); }
  };

  return (
    <div className="auth-wrap">
      <h2>Create your account</h2>
      <p className="sub">Join to save properties or post your own listings.</p>
      {error && <div className="alert">{error}</div>}
      <form onSubmit={submit}>
        <div className="field">
          <label>Full Name</label>
          <input required value={form.name} onChange={upd('name')} />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" required value={form.email} onChange={upd('email')} />
        </div>
        <div className="field">
          <label>Phone</label>
          <input value={form.phone} onChange={upd('phone')} placeholder="+92 3xx xxxxxxx" />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" required minLength={6} value={form.password} onChange={upd('password')} />
        </div>
        <div className="field">
          <label>Account Type</label>
          <select value={form.role} onChange={upd('role')}>
            <option value="user">Buyer / Renter</option>
            <option value="agent">Agent (post listings)</option>
          </select>
        </div>
        {form.role === 'agent' && (
          <div className="field">
            <label>Agency Name</label>
            <input value={form.agency} onChange={upd('agency')} placeholder="e.g. Premier Estates" />
          </div>
        )}
        <button className="btn btn-block" disabled={busy}>{busy ? 'Creating…' : 'Sign Up'}</button>
      </form>
      <p style={{ marginTop: 16, fontSize: 14 }}>Already have an account? <Link to="/login" className="muted-link">Login</Link></p>
    </div>
  );
}
