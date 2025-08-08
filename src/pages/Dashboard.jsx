import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import PasswordCard from "../components/PasswordCard"; // Corrected path if you follow the suggestion
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom"; // 👈 IMPORT THIS
import Swal from "sweetalert2";

const Dashboard = () => {
  const [passwords, setPasswords] = useState([]);
  const [secretKey, setSecretKey] = useState("");
  const [showDecrypted, setShowDecrypted] = useState(false);
  const [keySubmitted, setKeySubmitted] = useState(false);
  const navigate = useNavigate(); // 👈 INITIALIZE THIS

  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const curr_userID = localStorage.getItem("userID");
        if (!curr_userID) {
          console.error("No user ID found");
          return;
        }
        const passwordsRef = collection(db, "Users");
        const q = query(passwordsRef, where("userID", "==", curr_userID));
        const querySnapshot = await getDocs(q);
        const fetchedPasswords = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPasswords(fetchedPasswords);
      } catch (error) {
        console.error("Error fetching passwords:", error);
      }
    };
    fetchPasswords();
  }, []);

  const decryptPassword = (encryptedText) => {
    if (!secretKey.trim()) return "[Enter Secret Key]";
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      return originalText || "[Wrong Key]";
    } catch (error) {
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

  const handleEdit = (id) => {
    navigate(`/store-password/${id}`);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(db, "Users", id));
          setPasswords(passwords.filter(p => p.id !== id));
          Swal.fire(
            'Deleted!',
            'Your password has been deleted.',
            'success'
          )
        } catch (error) {
          console.error("Error deleting password: ", error);
          Swal.fire("Error!", "Could not delete the password.", "error");
        }
      }
    })
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
            className="w-full px-4 py-2.5 rounded-xl bg-gray-800/80 border border-cyan-500/20 text-white font-semibold placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
          />
          {!keySubmitted ? (
            <button onClick={handleKeySubmit} className="bg-cyan-600 text-white px-5 py-2.5 rounded-lg hover:bg-cyan-700 transition whitespace-nowrap font-semibold">
              Submit Key
            </button>
          ) : (
            <button onClick={handleKeyReset} className="bg-gray-600 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 transition whitespace-nowrap font-semibold">
              Change Key
            </button>
          )}
        </div>

        {keySubmitted && (
          <div className="mb-4 p-3 bg-green-900/50 border border-green-400 text-green-300 rounded-lg text-center">
            🔓 Secret key submitted. Passwords are now decrypted.
          </div>
        )}

        {passwords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-lg text-sky-400">No passwords saved yet!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {passwords.map((item) => (
              <PasswordCard
                key={item.id}
                id={item.id}
                site={item.site}
                username={item.username}
                password={
                  showDecrypted && keySubmitted
                    ? decryptPassword(item.password)
                    : "••••••••"
                }
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
