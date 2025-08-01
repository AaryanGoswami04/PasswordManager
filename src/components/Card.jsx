import React, { useState } from "react";
import { FiCopy, FiEye, FiEyeOff } from "react-icons/fi";

const Card = ({ site, username, password }) => {
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleCopy = () => {
    // Copy the actual password (which is already decrypted from Dashboard)
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Check if password is actually decrypted (not just dots)
  const isDecrypted = password && !password.includes("••••") && !password.startsWith("[");

  return (
    <div className="rounded-2xl shadow-xl bg-white/90 border border-blue-200 p-6 flex items-center justify-between transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-sky-800 mb-1">{site}</h2>
        <p className="text-sm text-gray-500">
          <span className="font-medium">Username:</span> {username}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-gray-500 text-sm font-medium">Password:</span>
          <span className="font-mono text-sky-700 ml-1">
            {showPassword && isDecrypted ? password : "••••••••"}
          </span>

          {isDecrypted && (
            <button
              onClick={togglePasswordVisibility}
              className="ml-2 group p-1 rounded hover:bg-blue-100 active:bg-blue-200 transition-colors"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FiEyeOff className="text-blue-600 group-hover:text-blue-900" />
              ) : (
                <FiEye className="text-blue-600 group-hover:text-blue-900" />
              )}
            </button>
          )}

          {isDecrypted && (
            <button
              onClick={handleCopy}
              className="group p-1 rounded hover:bg-sky-100 active:bg-sky-200 transition-colors"
              title="Copy password"
            >
              <FiCopy className="text-sky-600 group-hover:text-sky-900" />
            </button>
          )}

          <span
            className={`text-xs text-green-500 transition-opacity ${
              copied ? "opacity-100" : "opacity-0"
            }`}
          >
            Copied!
          </span>
        </div>

        {!isDecrypted && (
          <p className="text-xs text-gray-400 mt-1">
            Enter your secret key above to decrypt passwords
          </p>
        )}
      </div>
    </div>
  );
};

export default Card;