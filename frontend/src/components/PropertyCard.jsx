import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { formatPrice } from '../utils/format.js';

export default function PropertyCard({ property }) {
  const { user, toggleFavorite } = useAuth();
  const isFav = user?.favorites?.some((f) => (f._id || f) === property._id);

  const handleFav = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please log in to save properties.');
    await toggleFavorite(property._id);
  };

  return (
    <Link to={`/properties/${property._id}`} className="card">
      <div className="thumb">
        <img src={property.images?.[0]} alt={property.title} loading="lazy" />
        <span className={`badge ${property.purpose}`}>For {property.purpose}</span>
        <button className={`fav-btn ${isFav ? 'active' : ''}`} onClick={handleFav} title="Save">
          {isFav ? '♥' : '♡'}
        </button>
      </div>
      <div className="body">
        <div className="price">{formatPrice(property.price)}</div>
        <div className="title">{property.title}</div>
        <div className="loc">📍 {property.location}, {property.city}</div>
        <div className="specs">
          {property.bedrooms > 0 && <span>🛏 {property.bedrooms} Bed</span>}
          {property.bathrooms > 0 && <span>🛁 {property.bathrooms} Bath</span>}
          <span>📐 {property.area} {property.areaUnit}</span>
        </div>
      </div>
    </Link>
  );
}
