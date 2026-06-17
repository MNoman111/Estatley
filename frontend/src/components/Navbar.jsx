import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  // Close the dropdown whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  // Close the dropdown when clicking outside it or pressing Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
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

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="logo">
          🏠 Estat<span className="dot">ley</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/properties?purpose=sale">Buy</NavLink>
          <NavLink to="/properties?purpose=rent">Rent</NavLink>
          <NavLink to="/properties">All Properties</NavLink>
          {user ? (
            <div className="menu-wrap" ref={menuRef}>
              <button className="btn-ghost" onClick={() => setOpen((o) => !o)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <img className="avatar" src={user.avatar} alt={user.name} />
                {user.name.split(' ')[0]} ▾
              </button>
              <div className={`menu ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/favorites">Saved Properties</Link>
                {(user.role === 'agent' || user.role === 'admin') && <Link to="/post">Post Property</Link>}
                <Link to={`/agents/${user._id}`}>My Profile</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <Link to="/register" className="btn btn-sm">Sign Up</Link>
            </>
          )}
          {(user?.role === 'agent' || user?.role === 'admin') && (
            <Link to="/post" className="btn btn-orange btn-sm">+ Post Ad</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
