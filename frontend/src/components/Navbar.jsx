import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="logo">
          🏠 Zameen<span className="dot">Clone</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/properties?purpose=sale">Buy</NavLink>
          <NavLink to="/properties?purpose=rent">Rent</NavLink>
          <NavLink to="/properties">All Properties</NavLink>
          {user ? (
            <div className="menu-wrap">
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
