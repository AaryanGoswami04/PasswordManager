import React from 'react';
import { FiEdit, FiTrash2, FiCopy } from 'react-icons/fi';

const PasswordCard = ({ id, site, username, password, onEdit, onDelete }) => {

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a small "Copied!" notification here if you like
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg p-6 text-white transition-all hover:border-cyan-500/50 hover:shadow-cyan-500/10">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-2xl text-cyan-300">{site}</h3>
          <p className="text-gray-400 font-mono">{username}</p>
        </div>
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onEdit(id)}
            className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
            title="Edit Password"
          >
            <FiEdit size={20} />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete Password"
          >
            <FiTrash2 size={20} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between bg-gray-900/70 rounded-lg p-3">
        <span className="font-mono text-lg break-all">
          {password}
        </span>
        <button
          onClick={() => handleCopy(password)}
          className="p-2 text-gray-400 hover:text-cyan-300 transition-colors"
          title="Copy Password"
        >
          <FiCopy size={20} />
        </button>
      </div>
    </div>
  );
};

export default PasswordCard;
