import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setBusy(false); }
  };

  return (
    <div className="auth-wrap">
      <h2>Welcome back</h2>
      <p className="sub">Log in to manage your listings and saved properties.</p>
      <div className="hint">Demo: <b>imran@estatley.pk</b> (agent) or <b>user@estatley.pk</b> — password <b>password123</b></div>
      {error && <div className="alert">{error}</div>}
      <form onSubmit={submit}>
        <div className="field">
          <label>Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn btn-block" disabled={busy}>{busy ? 'Logging in…' : 'Login'}</button>
      </form>
      <p style={{ marginTop: 16, fontSize: 14 }}>No account? <Link to="/register" className="muted-link">Sign up</Link></p>
    </div>
  );
}
