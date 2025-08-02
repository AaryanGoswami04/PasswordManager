import React, { useState ,useEffect} from 'react';
import { db, auth, collection, addDoc } from '../firebase/config'; // adjust path if needed
import { onAuthStateChanged } from 'firebase/auth';
import CryptoJS from "crypto-js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


const StorePassword = () => {
    const navigate = useNavigate();
  useEffect(() => {
    const userID = localStorage.getItem("userID");
    if (!userID) {
      navigate("/");
    }
  }, [navigate]);
  const [USER_SECRET_KEY,setUSER_SECRET_KEY] = useState(() => {
    return localStorage.getItem('secretKey') || "TOPSECRET";
  });
  const encryptPassword = (plainTextPassword, secretKey) => {
  return CryptoJS.AES.encrypt(plainTextPassword, secretKey).toString();
  };
  const [formData, setFormData] = useState({
    site: '',
    username: '',
    password: '',
  });
    const [userID, setUserID] = useState(() => {
    // Initialize state lazily from localStorage, fallback to null
    return localStorage.getItem('userID') || null;
  });

  // Optional: if you want to sync state if localStorage changes outside React
  useEffect(() => {
    const handleStorageChange = () => {
      setUserID(localStorage.getItem('userID') || null);
      setUSER_SECRET_KEY(localStorage.getItem('secretKey') || "TOPSECRET");
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen for auth user
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserID(user.uid);
      else setUserID(null);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userID) {
      alert("You must be logged in to store a password.");
      return;
    }

    try {
      await addDoc(collection(db, "Users"), {
        ...formData,
        password:encryptPassword(formData.password, USER_SECRET_KEY),
        userID: userID,
      });
      Swal.fire({
                icon: "success",
                title: `Congrats!`,
                text: "Your Password has been saved.",
                showConfirmButton: true,
              })
      setFormData({ site: '', username: '', password: '' });
    } catch (error) {
      console.error("Error saving password: ", error);
      alert("Something went wrong!");
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-t from-black via-slate-800 to-black flex items-center justify-center px-6">
    <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-emerald-400/20 max-w-md w-full p-10 sm:p-12">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-7 text-emerald-300 drop-shadow tracking-tight">
        <span className="text-2xl align-middle pr-2">🔒</span>
        Store Your Password
      </h2>
      <form onSubmit={handleSubmit} className="space-y-7">
        <div>
          <label className="block text-xs font-bold mb-2 text-gray-300 tracking-wide">
            Site Name
          </label>
          <input
            type="text"
            name="site"
            value={formData.site}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-gray-800/80 border border-emerald-500/20 text-white font-semibold shadow-inner placeholder-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition"
            placeholder="e.g. Facebook, Gmail"
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-2 text-gray-300 tracking-wide">
            Username / Email
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-gray-800/80 border border-emerald-500/20 text-white font-semibold shadow-inner placeholder-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition"
            placeholder="e.g. user@email.com"
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-2 text-gray-300 tracking-wide">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-gray-800/80 border border-emerald-500/20 text-white font-semibold shadow-inner placeholder-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition"
            placeholder="Enter your secret 🔐"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500 to-sky-600 hover:from-emerald-400 hover:to-emerald-600 text-white font-bold py-3 rounded-2xl shadow-lg text-lg tracking-wide transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        >
          Save Password
        </button>
      </form>
    </div>
  </div>
);


};

export default StorePassword;
