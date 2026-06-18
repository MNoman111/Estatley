import { Link } from 'react-router-dom';
import LogoMark from './LogoMark.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-cols">
          <div>
            <div className="logo" style={{ color: '#fff' }}><LogoMark size={34} />Nest<span style={{ color: 'var(--gold)' }}>aro</span></div>
            <p style={{ marginTop: 10, fontSize: 14, maxWidth: 320 }}>
              Pakistan's modern property portal. Browse houses, flats, plots and commercial
              listings for sale and rent across major cities.
            </p>
            <div className="social">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Twitter">𝕏</a>
              <a href="#" aria-label="Instagram">◎</a>
              <a href="#" aria-label="LinkedIn">in</a>
            </div>
          </div>
          <div>
            <h4>Explore</h4>
            <Link to="/properties?purpose=sale">Properties for Sale</Link>
            <Link to="/properties?purpose=rent">Properties for Rent</Link>
            <Link to="/properties?type=Plot">Plots</Link>
            <Link to="/properties?type=Shop">Commercial</Link>
          </div>
          <div>
            <h4>Cities</h4>
            <Link to="/properties?city=Lahore">Lahore</Link>
            <Link to="/properties?city=Karachi">Karachi</Link>
            <Link to="/properties?city=Islamabad">Islamabad</Link>
            <Link to="/properties?city=Rawalpindi">Rawalpindi</Link>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Contact</a>
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
          </div>
        </div>
        <div className="copy">© {new Date().getFullYear()} Nestaro. All rights reserved.</div>
      </div>
    </footer>
  );
}
