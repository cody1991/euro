import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Map, FileText } from 'lucide-react';
import './App.css';
import MapPage from './pages/MapPage';
import ItineraryOverview from './pages/ItineraryOverview';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav style={{
      display: 'flex',
      gap: '15px',
      padding: '15px 30px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <Link 
        to="/" 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          borderRadius: '25px',
          textDecoration: 'none',
          color: 'white',
          fontWeight: 'bold',
          background: location.pathname === '/' ? 'rgba(255,255,255,0.25)' : 'transparent',
          transition: 'all 0.3s'
        }}
      >
        <Map size={20} />
        地图视图
      </Link>
      <Link 
        to="/overview" 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          borderRadius: '25px',
          textDecoration: 'none',
          color: 'white',
          fontWeight: 'bold',
          background: location.pathname === '/overview' ? 'rgba(255,255,255,0.25)' : 'transparent',
          transition: 'all 0.3s'
        }}
      >
        <FileText size={20} />
        行程总览
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/overview" element={<ItineraryOverview />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
