import React from "react";
import { Link } from "react-router-dom"; // or use `onClick` if you're not using React Router

const LandingPage = () => {
  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col items-center justify-center px-4">
    <div className="w-full max-w-2xl mx-auto p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-emerald-400/20 shadow-2xl flex flex-col items-center">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-center tracking-tight bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg animate-gradient-x">
        🔐 SecurePass
      </h1>
      <p className="text-lg md:text-2xl mb-10 text-emerald-200 text-center font-medium max-w-xl">
        Your digital vault to store and generate uncrackable passwords.<br />
        <span className="text-teal-300">Safety</span> meets <span className="text-indigo-300">simplicity</span>.
      </p>

      <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
        <Link to="/store-password" className="w-full md:w-auto">
          <button className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-teal-400 hover:to-emerald-600 px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 focus:ring-2 focus:ring-emerald-400/70 focus:outline-none animate-pulse-on-hover">
            Store Your Password
          </button>
        </Link>
        <Link to="/generate-password" className="w-full md:w-auto">
          <button className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-emerald-400 hover:from-violet-500 hover:to-emerald-500 px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 focus:ring-2 focus:ring-indigo-400/70 focus:outline-none animate-pulse-on-hover">
            Create Strong Password
          </button>
        </Link>
      </div>
    </div>
    <footer className="mt-14 text-sm text-gray-500 text-center drop-shadow-sm">
      Made with <span className="inline-block animate-pulse">🔒</span> by your trusted Password Bro
    </footer>
  </div>
);

};

export default LandingPage;
