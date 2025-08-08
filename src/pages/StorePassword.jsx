import React, { useState, useEffect } from "react";
// 👇 1. IMPORT everything you need in ONE line from each library
import { useParams, useNavigate } from "react-router-dom";
import { db, auth, collection, addDoc, doc, getDoc, updateDoc } from "../firebase/config"; 
import { onAuthStateChanged } from "firebase/auth";
import CryptoJS from "crypto-js";
import Swal from "sweetalert2";
import zxcvbn from "zxcvbn";

const StorePassword = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL if it exists

  // 👇 2. DEFINE all your state variables at the top
  const [formData, setFormData] = useState({
    site: "",
    username: "",
    password: "",
  });
  const [userID, setUserID] = useState(() => localStorage.getItem("userID") || null);
  const [USER_SECRET_KEY, setUSER_SECRET_KEY] = useState(() => localStorage.getItem("secretKey") || "TOPSECRET");
  const [strength, setStrength] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false); // 👈 This was missing

  // This useEffect handles fetching data for edit mode
  useEffect(() => {
    const fetchPasswordData = async () => {
      if (id) { // If there's an ID in the URL, we're in edit mode
        setIsEditMode(true);
        const docRef = doc(db, "Users", id);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            // Pre-fill form with site and username, leave password empty for security
            setFormData({
              site: data.site,
              username: data.username,
              password: "",
            });
          } else {
            console.error("No such document!");
            navigate("/dashboard"); // Redirect if password not found
          }
        } catch (error) {
            console.error("Error fetching document:", error);
            navigate("/dashboard");
        }
      } else {
        setIsEditMode(false); // Ensure edit mode is off if no ID
      }
    };

    // Check for user login first
    if (!userID) {
      navigate("/");
    } else {
      fetchPasswordData();
    }
  }, [id, navigate, userID]); // Dependencies for this effect

  // This useEffect keeps the userID in sync with Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserID(user.uid);
        localStorage.setItem('userID', user.uid);
      } else {
        setUserID(null);
        localStorage.removeItem('userID');
      }
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const encryptPassword = (plainTextPassword, secretKey) => {
    return CryptoJS.AES.encrypt(plainTextPassword, secretKey).toString();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      if (value) {
        setStrength(zxcvbn(value));
      } else {
        setStrength(null);
      }
    }
  };

  const proceedWithSave = async () => {
    if (!userID) {
      Swal.fire("Not Logged In", "You must be logged in.", "error");
      return;
    }
    
    try {
      if (isEditMode) {
        // --- UPDATE LOGIC ---
        const docRef = doc(db, "Users", id);
        await updateDoc(docRef, {
          password: encryptPassword(formData.password, USER_SECRET_KEY),
          lastModified: new Date(),
        });
        Swal.fire("Updated!", "Your password has been updated.", "success");
        navigate("/dashboard"); // Go back to dashboard after update
      } else {
        // --- CREATE LOGIC ---
        await addDoc(collection(db, "Users"), {
          ...formData,
          password: encryptPassword(formData.password, USER_SECRET_KEY),
          userID: userID,
          createdAt: new Date(),
        });
        Swal.fire("Saved!", "Your password has been saved.", "success");
        setFormData({ site: "", username: "", password: "" });
        setStrength(null);
      }
    } catch (error) {
      console.error("Error saving password: ", error);
      Swal.fire("Oops...", "Something went wrong!", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 👇 3. ADD a check for an empty password, especially important for edit mode
    if (formData.password.trim() === "") {
        Swal.fire("Empty Password", "The password field cannot be empty.", "warning");
        return;
    }
    const score = strength ? strength.score : 0;

    if (score < 3) {
      Swal.fire({
        title: "Weak Password!",
        text: "This password may be easy to guess. We recommend generating a more secure one.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#10B981",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Generate a Strong Password",
        cancelButtonText: "Save Anyway",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/generate-password");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          proceedWithSave();
        }
      });
    } else {
      proceedWithSave();
    }
  };

  const StrengthMeter = () => {
    if (!strength) return null;
    const score = strength.score;
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"];
    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

    return (
      <div className="mt-2">
        <div className="w-full bg-gray-600 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${colors[score]}`}
            style={{ width: `${((score + 1) / 5) * 100}%` }}
          ></div>
        </div>
        <p className={`text-xs mt-1 text-right ${colors[score].replace("bg", "text")}`}>
          {labels[score]}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-black via-slate-800 to-black flex items-center justify-center px-6">
      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-emerald-400/20 max-w-md w-full p-10 sm:p-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-7 text-emerald-300 drop-shadow tracking-tight">
          <span className="text-2xl align-middle pr-2">🔒</span>
          {isEditMode ? "Update Password" : "Store Your Password"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label className="block text-xs font-bold mb-2 text-gray-300 tracking-wide">Site Name</label>
            <input
              type="text"
              name="site"
              value={formData.site}
              onChange={handleChange}
              required
              disabled={isEditMode}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-800/80 border border-emerald-500/20 text-white font-semibold shadow-inner placeholder-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition disabled:bg-gray-700 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-2 text-gray-300 tracking-wide">Username / Email</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isEditMode}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-800/80 border border-emerald-500/20 text-white font-semibold shadow-inner placeholder-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition disabled:bg-gray-700 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-2 text-gray-300 tracking-wide">
              {isEditMode ? "New Password" : "Password"}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoFocus={isEditMode}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-800/80 border border-emerald-500/20 text-white font-semibold shadow-inner placeholder-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition"
              placeholder="Enter the new secret 🔐"
            />
            <StrengthMeter />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-sky-600 hover:from-emerald-400 hover:to-emerald-600 text-white font-bold py-3 rounded-2xl shadow-lg text-lg tracking-wide transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {isEditMode ? "Update Password" : "Save Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StorePassword;