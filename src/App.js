import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StorePassword from './pages/StorePassword';
import Navbar from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import PasswordGenerator from './pages/CreatePassword';
import SecurityDashboard from './pages/SecurityDashboard';
function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route  path="/generate-password" element={<PasswordGenerator />} />
        <Route path="/store-password/:id?" element={<StorePassword />} />
        <Route  path="/dashboard" element={<Dashboard />} />
        <Route path="/security-dashboard" element={<SecurityDashboard />} />
      </Routes>
      <Footer/>
    </Router>
  ); 
}

export default App;
