import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import PasswordCard from "../components/Card";
import CryptoJS from "crypto-js"; // Make sure this is installed via npm

const Dashboard = () => {
  const [passwords, setPasswords] = useState([]);
  const [secretKey, setSecretKey] = useState(""); // User's secret key
  const [showDecrypted, setShowDecrypted] = useState(false);

  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const curr_userID = localStorage.getItem("userID") || null;
        const passwordsRef = collection(db, "Users");
        const q = query(passwordsRef, where("userID", "==", curr_userID));
        const querySnapshot = await getDocs(q);
        const fetchedPasswords = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedPasswords.push({
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
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      return originalText || "[Wrong Key]";
    } catch (error) {
      return "[Error]";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-sky-200 via-white to-sky-100 py-10 px-4 flex flex-col items-center">
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
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-400"
          />
          <button
            onClick={() => setShowDecrypted(!showDecrypted)}
            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition"
          >
            {showDecrypted ? "Submit" : "Submitted!"}
          </button>
        </div>

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
            {passwords.map((item, index) => (
              <PasswordCard
                key={index}
                site={item.site}
                username={item.username}
                password={
                  showDecrypted
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
