import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, provider, signInWithPopup } from "../firebase/config";
import { signOut } from "firebase/auth";
import Swal from "sweetalert2";

const Navbar = () => {
  const [isAuth, setIsAuth] = useState(() => {
    return localStorage.getItem('isAuth') || false;
  });

  // A new state to hold the secret key input value
  //const [secretKey, setSecretKey] = useState("");

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userID = result.user.uid;
      localStorage.setItem("userID", userID);
      localStorage.setItem("isAuth", true);
      setIsAuth(true); // Update the state immediately

      // Ask for the secret key after successful login
      const { value: key } = await Swal.fire({
        title: "Enter Your Secret Key",
        input: "password",
        inputLabel: "This key is used to encrypt your passwords.",
        inputPlaceholder: "Enter your secret key",
        inputAttributes: {
          maxlength: 32,
          autocapitalize: "off",
          autocorrect: "off",
        },
        confirmButtonText: "Save Key",
        showCancelButton: true,
        allowOutsideClick: false,
        inputValidator: (value) => {
          if (!value) {
            return "You need to enter a secret key!";
          }
        },
      });

      if (key) {
        localStorage.setItem("secretKey", key);
        Swal.fire({
          icon: "success",
          title: `Welcome, ${result.user.displayName}!`,
          text: "Your secret key has been saved.",
          showConfirmButton: true,
        }).then(() => {
          // Navigate after the user confirms the welcome message
          window.location.href = "/";
        });
      } else {
        // Handle case where user cancels the key input
        // You might want to log them out or show a warning
        Swal.fire({
          icon: "warning",
          title: "Key Not Saved",
          text: "You can enter your secret key later, but some features may be unavailable.",
        });
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Login error:", err);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.message || "Something went wrong. Please try again.",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userID");
      localStorage.removeItem("isAuth");
      localStorage.removeItem("secretKey"); // This is the key change

      Swal.fire({
        icon: "info",
        title: "Logged out",
        text: "You've been successfully logged out.",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (err) {
      console.error("Logout error:", err);
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: err.message || "Something went wrong during logout.",
      });
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuth(localStorage.getItem('isAuth') || false);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <nav className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-950 backdrop-blur-md border-b border-emerald-600/30 shadow-2xl px-8 py-4 flex items-center justify-between select-none">
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
        {isAuth && (
          <>
            <Link
              to="/dashboard"
              className="relative px-3 py-1.5 rounded-lg font-medium text-white transition-all duration-200 hover:text-emerald-400 hover:bg-white/5 focus:outline-none"
            >
              Dashboard
            </Link>
            <Link
              to="/store-password"
              className="relative px-3 py-1.5 rounded-lg font-medium text-white transition-all duration-200 hover:text-emerald-400 hover:bg-white/5 focus:outline-none"
            >
              Store
              <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-emerald-400 transition-all group-hover:w-1/2 group-hover:h-1 group-hover:left-0" />
            </Link>
          </>
        )}
        <Link
          to="/generate-password"
          className="relative px-3 py-1.5 rounded-lg font-medium text-white transition-all duration-200 hover:text-emerald-400 hover:bg-white/5 focus:outline-none"
        >
          Generate
        </Link>
        {!isAuth ? (
          <button
            onClick={handleLogin}
            className="ml-3 bg-emerald-600 hover:bg-emerald-700 px-5 py-2 rounded-lg font-bold text-white shadow-xl hover:shadow-emerald-400/30 transition-all duration-200 border border-emerald-500"
          >
            Login
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="ml-3 bg-emerald-600 hover:bg-emerald-700 px-5 py-2 rounded-lg font-bold text-white shadow-xl hover:shadow-emerald-400/30 transition-all duration-200 border border-emerald-500"
          >
            LogOut
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;