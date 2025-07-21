// components/PasswordCard.jsx
import React, { useState } from "react";
import { FiCopy } from "react-icons/fi";

const Card = ({ site, username, password }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="rounded-2xl shadow-xl bg-white/90 border border-blue-200 p-6 flex items-center justify-between transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
      <div>
        <h2 className="text-lg font-semibold text-sky-800 mb-1">{site}</h2>
        <p className="text-sm text-gray-500">
          <span className="font-medium">Username:</span> {username}
        </p>
        <div className="flex items-center gap-1">
          <span className="text-gray-500 text-sm font-medium">Password:</span>
          <span className="font-mono text-sky-700 ml-1">{password.replace(/./g, "•")}</span>
          <button
            onClick={handleCopy}
            className="ml-2 group p-1 rounded hover:bg-sky-100 active:bg-sky-200 transition-colors"
            title="Copy password"
          >
            <FiCopy className="text-sky-600 group-hover:text-sky-900" />
          </button>
          <span className={`ml-1 text-xs text-green-500 transition-opacity ${copied ? "opacity-100" : "opacity-0"}`}>Copied!</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
