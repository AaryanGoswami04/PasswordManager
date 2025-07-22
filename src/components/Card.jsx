import React, { useState } from "react";
import { FiCopy, FiUnlock } from "react-icons/fi";
import CryptoJS from "crypto-js";

const Card = ({ site, username, password }) => {
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [decryptedPassword, setDecryptedPassword] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(showPassword ? decryptedPassword : "••••••••");
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleDecrypt = () => {
    try {
      const key = localStorage.getItem("USER_SECRET_KEY") || "TOPSECRET";
      const bytes = CryptoJS.AES.decrypt(password, key);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      setDecryptedPassword(originalText);
      setShowPassword(true);
    } catch (error) {
      console.error("Decryption failed:", error);
      alert("Failed to decrypt. Check your secret key.");
    }
  };

  return (
    <div className="rounded-2xl shadow-xl bg-white/90 border border-blue-200 p-6 flex items-center justify-between transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
      <div>
        <h2 className="text-lg font-semibold text-sky-800 mb-1">{site}</h2>
        <p className="text-sm text-gray-500">
          <span className="font-medium">Username:</span> {username}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-gray-500 text-sm font-medium">Password:</span>
          <span className="font-mono text-sky-700 ml-1">
            {showPassword ? decryptedPassword : password.replace(/./g, "•")}
          </span>

          <button
            onClick={handleDecrypt}
            className="ml-2 group p-1 rounded hover:bg-green-100 active:bg-green-200 transition-colors"
            title="Decrypt password"
          >
            <FiUnlock className="text-green-600 group-hover:text-green-900" />
          </button>

          <button
            onClick={handleCopy}
            className="group p-1 rounded hover:bg-sky-100 active:bg-sky-200 transition-colors"
            title="Copy password"
          >
            <FiCopy className="text-sky-600 group-hover:text-sky-900" />
          </button>

          <span
            className={`text-xs text-green-500 transition-opacity ${
              copied ? "opacity-100" : "opacity-0"
            }`}
          >
            Copied!
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
