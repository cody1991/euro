import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Home } from 'lucide-react';
import './Header.css';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <MapPin className="logo-icon" />
          <span>欧洲旅游规划</span>
        </Link>

        <nav className="nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <Home className="nav-icon" />
            首页
          </Link>
          <Link
            to="/map"
            className={`nav-link ${location.pathname === '/map' ? 'active' : ''}`}
          >
            <MapPin className="nav-icon" />
            地图
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
