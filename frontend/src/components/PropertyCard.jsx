import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatPrice } from '../utils/format.js';

export default function PropertyCard({ property }) {
  const { user, toggleFavorite } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const isFav = user?.favorites?.some((f) => (f._id || f) === property._id);

  const handleFav = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast('Please log in to save properties');
      return navigate('/login');
    }
    const fav = await toggleFavorite(property._id);
    toast(fav ? '❤️ Saved to favorites' : 'Removed from favorites');
  };

  return (
    <Link to={`/properties/${property._id}`} className="card">
      <div className="thumb">
        <img src={property.images?.[0]} alt={property.title} loading="lazy" />
        <span className={`badge ${property.purpose}`}>For {property.purpose}</span>
        <span className="badge type">{property.type}</span>
        <button className={`fav-btn ${isFav ? 'active' : ''}`} onClick={handleFav} title="Save" aria-label="Save property">
          {isFav ? '♥' : '♡'}
        </button>
      </div>
      <div className="body">
        <div className="price">{formatPrice(property.price)}</div>
        <div className="title">{property.title}</div>
        <div className="loc">📍 {property.location}, {property.city}</div>
        <div className="specs">
          {property.bedrooms > 0 && <span>🛏 {property.bedrooms} Beds</span>}
          {property.bathrooms > 0 && <span>🛁 {property.bathrooms} Baths</span>}
          <span>📐 {property.area} {property.areaUnit}</span>
        </div>
      </div>
    </Link>
  );
}
