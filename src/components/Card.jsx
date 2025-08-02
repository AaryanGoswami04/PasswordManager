import React, { useState } from "react";
import { FiCopy, FiEye, FiEyeOff, FiTrash2 } from "react-icons/fi";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config"; // adjust the path to your firebase config
import Swal from "sweetalert2";
const Card = ({ site, username, password, id,onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleDelete = async () => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This will permanently delete the entry.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      await deleteDoc(doc(db, "Users", id)); // Replace "Users" if needed
      Swal.fire("Deleted!", "The password entry has been deleted.", "success");
      onDelete(id); // Update UI
    } catch (error) {
      console.error("Error deleting document:", error);
      Swal.fire("Error", "Failed to delete the entry.", "error");
    }
  }
};

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
            <>
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

              <button
                onClick={handleCopy}
                className="group p-1 rounded hover:bg-sky-100 active:bg-sky-200 transition-colors"
                title="Copy password"
              >
                <FiCopy className="text-sky-600 group-hover:text-sky-900" />
              </button>

              <button
                onClick={handleDelete}
                className="group p-1 rounded hover:bg-red-100 active:bg-red-200 transition-colors"
                title="Delete entry"
              >
                <FiTrash2 className="text-red-500 group-hover:text-red-800" />
              </button>
            </>
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
