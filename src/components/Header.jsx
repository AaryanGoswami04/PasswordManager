import React from "react";
import { Link } from "react-router-dom";
import { auth, provider, signInWithPopup } from "../firebase/config";

const Navbar = () => {
 const handleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const userID = result.user.uid; // Firebase unique user ID
    localStorage.setItem('userID', userID);  // Store it locally for quick access later
    alert(`Welcome ${result.user.displayName}`);
  } catch (err) {
    console.error("Login error:", err);
  }
};


  return (
  <nav className="bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-md border-b border-emerald-600/30 shadow-2xl px-8 py-4 flex items-center justify-between select-none">
    <Link
      to="/"
      className="flex items-center text-3xl font-extrabold tracking-tighter text-emerald-400 drop-shadow-lg hover:scale-105 hover:animate-pulse transition-all duration-300"
    >
      <span className="mr-2 text-4xl">🔐</span>
      <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-600 bg-clip-text text-transparent">
        VaultX
      </span>
    </Link>

    <div className="flex items-center gap-3 md:gap-6">
      <Link
        to="/store-password"
        className="relative px-3 py-1.5 rounded-lg font-medium text-white transition-all duration-200 hover:text-emerald-400 hover:bg-white/5 focus:outline-none"
      >
        Store
        <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-emerald-400 transition-all group-hover:w-1/2 group-hover:h-1 group-hover:left-0" />
      </Link>
      <Link
        to="/generate-password"
        className="relative px-3 py-1.5 rounded-lg font-medium text-white transition-all duration-200 hover:text-emerald-400 hover:bg-white/5 focus:outline-none"
      >
        Generate
      </Link>
      <button
        onClick={handleLogin}
        className="ml-3 bg-emerald-600 hover:bg-emerald-700 px-5 py-2 rounded-lg font-bold text-white shadow-xl hover:shadow-emerald-400/30 transition-all duration-200 border border-emerald-500"
      >
        Login
      </button>
    </div>
  </nav>
);
};

export default Navbar;
