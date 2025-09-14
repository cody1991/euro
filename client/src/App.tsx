import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ItineraryPage from './pages/ItineraryPage';
import MapPage from './pages/MapPage';
import SummaryPage from './pages/SummaryPage';
import BudgetPage from './pages/BudgetPage';
import WeatherPage from './pages/WeatherPage';
import TravelTipsPage from './pages/TravelTipsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/itinerary/:id" element={<ItineraryPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/tips" element={<TravelTipsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
