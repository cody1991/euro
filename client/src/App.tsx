import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Map, FileText, ClipboardList, Route as RouteIcon, BookOpen, Hotel } from 'lucide-react';
import './App.css';
import MapPage from './pages/MapPage';
import ItineraryOverview from './pages/ItineraryOverview';
import VisaItinerary from './pages/VisaItinerary';
import ItineraryTimeline from './components/ItineraryTimeline';
import VisaGuide from './pages/VisaGuide';
import HotelGuide from './pages/HotelGuide';

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
      <Link
        to="/timeline"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          borderRadius: '25px',
          textDecoration: 'none',
          color: 'white',
          fontWeight: 'bold',
          background: location.pathname === '/timeline' ? 'rgba(255,255,255,0.25)' : 'transparent',
          transition: 'all 0.3s'
        }}
      >
        <RouteIcon size={20} />
        行程路线
      </Link>
      <Link
        to="/visa"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          borderRadius: '25px',
          textDecoration: 'none',
          color: 'white',
          fontWeight: 'bold',
          background: location.pathname === '/visa' ? 'rgba(255,255,255,0.25)' : 'transparent',
          transition: 'all 0.3s'
        }}
      >
        <ClipboardList size={20} />
        签证行程单
      </Link>
      <Link
        to="/guide"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          borderRadius: '25px',
          textDecoration: 'none',
          color: 'white',
          fontWeight: 'bold',
          background: location.pathname === '/guide' ? 'rgba(255,255,255,0.25)' : 'transparent',
          transition: 'all 0.3s'
        }}
      >
        <BookOpen size={20} />
        签证指南
      </Link>
      <Link
        to="/hotel"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          borderRadius: '25px',
          textDecoration: 'none',
          color: 'white',
          fontWeight: 'bold',
          background: location.pathname === '/hotel' ? 'rgba(255,255,255,0.25)' : 'transparent',
          transition: 'all 0.3s'
        }}
      >
        <Hotel size={20} />
        酒店攻略
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
          <Route path="/timeline" element={<ItineraryTimeline />} />
          <Route path="/visa" element={<VisaItinerary />} />
          <Route path="/guide" element={<VisaGuide />} />
          <Route path="/hotel" element={<HotelGuide />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
