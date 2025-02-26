import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import PlayerComparison from './pages/PlayerComparison';
import Clusters from './pages/Clusters';
import About from './pages/About';
import Documentation from './pages/Documentation';
import Privacy from './pages/Privacy';
import './App.css';

/**
 * App component
 * Main component that sets up routing and application structure
 */
const App: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/comparison" element={<PlayerComparison />} />
          <Route path="/clusters" element={<Clusters />} />
          <Route path="/about" element={<About />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
