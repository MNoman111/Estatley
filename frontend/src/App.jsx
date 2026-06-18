import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import BackToTop from './components/BackToTop.jsx';

// Code-split each page so the initial bundle stays small.
const Home = lazy(() => import('./pages/Home.jsx'));
const Listings = lazy(() => import('./pages/Listings.jsx'));
const PropertyDetail = lazy(() => import('./pages/PropertyDetail.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const PostProperty = lazy(() => import('./pages/PostProperty.jsx'));
const AgentProfile = lazy(() => import('./pages/AgentProfile.jsx'));
const Favorites = lazy(() => import('./pages/Favorites.jsx'));

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Suspense fallback={<div className="spinner">Loading…</div>}>
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
        </Suspense>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
