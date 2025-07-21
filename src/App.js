import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StorePassword from './pages/StorePassword';
import Navbar from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import PasswordGenerator from './pages/CreatePassword';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/generate-password" element={<PasswordGenerator />} />
        <Route path="/store-password" element={<StorePassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
