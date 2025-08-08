import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl mx-auto p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-emerald-400/20 shadow-2xl flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-center tracking-tight bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg animate-gradient-x">
          🔐 VaultX
        </h1>
        <p className="text-lg md:text-2xl mb-10 text-emerald-200 text-center font-medium max-w-xl">
          Your digital vault to store and generate uncrackable passwords.
          <br />
          <span className="text-teal-300">Safety</span> meets <span className="text-indigo-300">simplicity</span>.
        </p>

        {/* Updated button container */}
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
          <Link to="/store-password" className="w-full md:w-auto">
            <button className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-teal-400 hover:to-emerald-600 px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 focus:ring-2 focus:ring-emerald-400/70 focus:outline-none">
              Store a Password
            </button>
          </Link>
          <Link to="/generate-password" className="w-full md:w-auto">
            <button className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-emerald-400 hover:from-violet-500 hover:to-emerald-500 px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 focus:ring-2 focus:ring-indigo-400/70 focus:outline-none">
              Create a Password
            </button>
          </Link>
        </div>

        {/* ---> ADD THIS NEW BUTTON <--- */}
        <div className="mt-6 w-full max-w-md">
          <Link to="/security-dashboard" className="w-full">
            <button className="w-full bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-cyan-500 hover:to-sky-600 px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 focus:ring-2 focus:ring-cyan-400/70 focus:outline-none">
              Security Health Check
            </button>
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default LandingPage;