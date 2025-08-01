import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import PasswordCard from "../components/Card";
import CryptoJS from "crypto-js";

const Dashboard = () => {
  const [passwords, setPasswords] = useState([]);
  const [secretKey, setSecretKey] = useState(""); // User's secret key
  const [showDecrypted, setShowDecrypted] = useState(false);
  const [keySubmitted, setKeySubmitted] = useState(false);

  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const curr_userID = localStorage.getItem("userID") || null;
        if (!curr_userID) {
          console.error("No user ID found");
          return;
        }

        const passwordsRef = collection(db, "Users");
        const q = query(passwordsRef, where("userID", "==", curr_userID));
        const querySnapshot = await getDocs(q);
        const fetchedPasswords = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedPasswords.push({
            id: doc.id, // Add document ID for uniqueness
            site: data.site,
            username: data.username,
            encryptedPassword: data.password,
          });
        });

        setPasswords(fetchedPasswords);
      } catch (error) {
        console.error("Error fetching passwords:", error);
      }
    };

    fetchPasswords();
  }, []);

  const decryptPassword = (encryptedText) => {
    if (!secretKey.trim()) {
      return "[Enter Secret Key]";
    }

    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      
      // Check if decryption actually worked
      if (!originalText) {
        return "[Wrong Key]";
      }
      
      return originalText;
    } catch (error) {
      console.error("Decryption error:", error);
      return "[Decryption Error]";
    }
  };

  const handleKeySubmit = () => {
    if (!secretKey.trim()) {
      alert("Please enter your secret key!");
      return;
    }
    setKeySubmitted(true);
    setShowDecrypted(true);
  };

  const handleKeyReset = () => {
    setKeySubmitted(false);
    setShowDecrypted(false);
    setSecretKey("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-slate-800 to-black py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-800 via-cyan-500 to-blue-500 drop-shadow-lg mb-6">
          🔐 Your Secure Passwords
        </h1>

        <div className="mb-8 flex gap-4 items-center">
          <input
            type="password"
            placeholder="Enter your secret key"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            disabled={keySubmitted}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-400 disabled:bg-gray-100"
          />
          {!keySubmitted ? (
            <button
              onClick={handleKeySubmit}
              className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition whitespace-nowrap"
            >
              Submit Key
            </button>
          ) : (
            <button
              onClick={handleKeyReset}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition whitespace-nowrap"
            >
              Change Key
            </button>
          )}
        </div>

        {keySubmitted && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            🔓 Secret key submitted.
          </div>
        )}

        {passwords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3416/3416078.png"
              alt="No Passwords"
              className="w-24 opacity-60 mb-6 animate-pulse"
            />
            <p className="text-lg text-sky-600">No passwords saved yet!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {passwords.map((item) => (
              <PasswordCard
                key={item.id}
                site={item.site}
                username={item.username}
                password={
                  showDecrypted && keySubmitted
                    ? decryptPassword(item.encryptedPassword)
                    : "••••••••"
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;