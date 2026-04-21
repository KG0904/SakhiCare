import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { FiHome, FiHeart, FiCalendar, FiMessageCircle, FiBookOpen, FiStar, FiMenu, FiX, FiLogOut, FiShield, FiUser } from 'react-icons/fi';

/**
 * Navbar — Responsive navigation bar with mobile hamburger menu.
 * Shows different links based on authentication state.
 */
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false);
  };

  // Don't show navbar on auth pages
  if (!token) return null;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🌸</span>
          SakhiCare
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <li><Link to="/" className={isActive('/')} onClick={() => setMenuOpen(false)}><FiHome className="nav-icon" /> Dashboard</Link></li>
          <li><Link to="/health" className={isActive('/health')} onClick={() => setMenuOpen(false)}><FiHeart className="nav-icon" /> Health</Link></li>
          <li><Link to="/pregnancy" className={isActive('/pregnancy')} onClick={() => setMenuOpen(false)}><FiCalendar className="nav-icon" /> Pregnancy</Link></li>
          <li><Link to="/education" className={isActive('/education')} onClick={() => setMenuOpen(false)}><FiBookOpen className="nav-icon" /> Education</Link></li>
          <li><Link to="/safe-sex" className={isActive('/safe-sex')} onClick={() => setMenuOpen(false)}><FiShield className="nav-icon" /> Safe Sex</Link></li>
          <li><Link to="/quotes" className={isActive('/quotes')} onClick={() => setMenuOpen(false)}><FiStar className="nav-icon" /> Quotes</Link></li>
          <li><Link to="/chatbot" className={isActive('/chatbot')} onClick={() => setMenuOpen(false)}><FiMessageCircle className="nav-icon" /> Chat</Link></li>
          <li><button className="nav-logout-btn" onClick={handleLogout}><FiLogOut style={{ marginRight: 4 }} /> Logout</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
