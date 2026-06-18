import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import LogoMark from './LogoMark.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => { setOpen(false); }, [location.pathname, location.search]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  const isAgent = user?.role === 'agent' || user?.role === 'admin';

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <Link to="/" className="logo"><LogoMark size={36} />Nest<span className="dot">aro</span></Link>
        <nav className="nav-links">
          <NavLink to="/properties?purpose=sale">Buy</NavLink>
          <NavLink to="/properties?purpose=rent">Rent</NavLink>
          <NavLink to="/properties">All Properties</NavLink>

          <button className="theme-toggle icon" onClick={toggle} aria-label="Toggle theme" title="Toggle dark mode">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div className="menu-wrap" ref={menuRef}>
              <button className="btn-ghost" onClick={() => setOpen((o) => !o)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <img className="avatar" src={user.avatar} alt={user.name} />
                <span className="icon">{user.name.split(' ')[0]} ▾</span>
              </button>
              <div className={`menu ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
                <Link to="/dashboard">📊 Dashboard</Link>
                <Link to="/favorites">❤️ Saved Properties</Link>
                {isAgent && <Link to="/post">➕ Post Property</Link>}
                <Link to={`/agents/${user._id}`}>👤 My Profile</Link>
                <button onClick={handleLogout}>🚪 Logout</button>
              </div>
            </div>
          ) : (
            <>
              <NavLink to="/login" className="icon">Login</NavLink>
              <Link to="/register" className="btn btn-sm">Sign Up</Link>
            </>
          )}
          {isAgent && <Link to="/post" className="btn btn-orange btn-sm icon">+ Post Ad</Link>}
        </nav>
      </div>
    </header>
  );
}
