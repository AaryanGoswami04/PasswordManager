import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CreatePassword from './pages/CreatePassword';
import StorePassword from './pages/StorePassword';
import Navbar from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/generate-password" element={<CreatePassword />} />
        <Route path="/store-password" element={<StorePassword />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
