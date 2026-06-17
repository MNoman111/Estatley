import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Listings from './pages/Listings.jsx';
import PropertyDetail from './pages/PropertyDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PostProperty from './pages/PostProperty.jsx';
import AgentProfile from './pages/AgentProfile.jsx';
import Favorites from './pages/Favorites.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Listings />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/agents/:id" element={<AgentProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/post" element={<ProtectedRoute roles={['agent', 'admin']}><PostProperty /></ProtectedRoute>} />
          <Route path="/post/:id" element={<ProtectedRoute roles={['agent', 'admin']}><PostProperty /></ProtectedRoute>} />
          <Route path="*" element={<div className="center-empty">404 — Page not found</div>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
