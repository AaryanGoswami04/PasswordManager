// src/pages/SecurityDashboard.jsx

import React, { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import CryptoJS from "crypto-js";
import zxcvbn from "zxcvbn";
import { FiAlertTriangle, FiCheckCircle, FiShield } from "react-icons/fi";

const SecurityDashboard = () => {
  const [secretKey, setSecretKey] = useState("");
  const [keySubmitted, setKeySubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  // Decryption function, similar to your main dashboard
  const decryptPassword = (encryptedText, key) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, key);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      return originalText || null;
    } catch {
      return null;
    }
  };

  const runSecurityAnalysis = async () => {
    if (!secretKey.trim()) {
      alert("Please provide a secret key.");
      return;
    }
    setIsLoading(true);
    setKeySubmitted(true);

    const curr_userID = localStorage.getItem("userID");
    if (!curr_userID) {
      setIsLoading(false);
      return;
    }

    // 1. Fetch all passwords
    const passwordsRef = collection(db, "Users");
    const q = query(passwordsRef, where("userID", "==", curr_userID));
    const querySnapshot = await getDocs(q);
    
    const allPasswords = [];
    querySnapshot.forEach((doc) => {
      allPasswords.push({ id: doc.id, ...doc.data() });
    });

    // 2. Decrypt all passwords
    const decryptedEntries = allPasswords.map(item => ({
      ...item,
      decryptedPass: decryptPassword(item.password, secretKey)
    })).filter(item => item.decryptedPass); // Filter out any that failed decryption

    if (decryptedEntries.length === 0 && allPasswords.length > 0) {
      alert("Wrong secret key. Could not decrypt any passwords.");
      setIsLoading(false);
      setKeySubmitted(false);
      setSecretKey("");
      return;
    }

    // 3. Perform Analysis
    const passwordMap = new Map();
    const weakPasswords = [];
    const reusedPasswords = new Map();
    const oldPasswords = [];
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    decryptedEntries.forEach(item => {
      // Check for weakness
      if (zxcvbn(item.decryptedPass).score < 3) {
        weakPasswords.push(item);
      }

      // Check for reuse
      if (passwordMap.has(item.decryptedPass)) {
        passwordMap.set(item.decryptedPass, [...passwordMap.get(item.decryptedPass), item.site]);
      } else {
        passwordMap.set(item.decryptedPass, [item.site]);
      }

      // Check for age
      if (item.createdAt && item.createdAt.toDate() < oneYearAgo) {
        oldPasswords.push(item);
      }
    });

    passwordMap.forEach((sites, pass) => {
      if (sites.length > 1) {
        reusedPasswords.set(pass, sites);
      }
    });

    setAnalysis({
      weak: weakPasswords,
      reused: reusedPasswords,
      old: oldPasswords,
      total: allPasswords.length
    });
    setIsLoading(false);
  };

  const handleReset = () => {
    setSecretKey("");
    setKeySubmitted(false);
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-10 px-4 text-white">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 flex items-center justify-center gap-3">
          <FiShield className="text-cyan-400" /> Security Dashboard
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Analyze your password vault for weak, reused, or old passwords.
        </p>

        {!keySubmitted ? (
          <div className="mb-8 flex gap-4 items-center max-w-lg mx-auto">
            <input
              type="password"
              placeholder="Enter your secret key to begin analysis"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-800/80 border border-cyan-500/20 text-white font-semibold placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
            <button onClick={runSecurityAnalysis} className="bg-cyan-600 px-5 py-2.5 rounded-lg hover:bg-cyan-700 transition whitespace-nowrap font-semibold">
              Analyze
            </button>
          </div>
        ) : (
          <div className="text-center mb-8">
            <button onClick={handleReset} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
              Reset and Analyze Again
            </button>
          </div>
        )}

        {isLoading && <p className="text-center text-lg">Analyzing your vault...</p>}

        {analysis && !isLoading && (
          <div className="space-y-6">
            <AnalysisCard title="Reused Passwords" icon={<FiAlertTriangle className="text-red-400" />} count={analysis.reused.size}>
              {Array.from(analysis.reused.entries()).map(([pass, sites]) => (
                <div key={pass} className="p-3 bg-gray-800 rounded-md">
                  <p className="font-mono text-sm break-all text-red-300">"{pass}"</p>
                  <p className="text-xs text-gray-400 mt-1">Used on: {sites.join(', ')}</p>
                </div>
              ))}
            </AnalysisCard>
            <AnalysisCard title="Weak Passwords" icon={<FiAlertTriangle className="text-orange-400" />} count={analysis.weak.length}>
              {analysis.weak.map(item => (
                <div key={item.id} className="p-3 bg-gray-800 rounded-md">
                  <p className="font-mono text-sm break-all text-orange-300">"{item.decryptedPass}"</p>
                  <p className="text-xs text-gray-400 mt-1">For site: {item.site}</p>
                </div>
              ))}
            </AnalysisCard>
             <AnalysisCard title="Old Passwords (over 1 year)" icon={<FiAlertTriangle className="text-yellow-400" />} count={analysis.old.length}>
              {analysis.old.map(item => (
                <div key={item.id} className="p-3 bg-gray-800 rounded-md">
                   <p className="font-mono text-sm break-all text-yellow-300">Password for {item.site}</p>
                   <p className="text-xs text-gray-400 mt-1">Created on: {item.createdAt.toDate().toLocaleDateString()}</p>
                </div>
              ))}
            </AnalysisCard>
          </div>
        )}
      </div>
    </div>
  );
};

// A helper component for displaying the analysis results beautifully
const AnalysisCard = ({ title, icon, count, children }) => {
  const hasIssues = count > 0;
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {hasIssues ? icon : <FiCheckCircle className="text-green-400" />}
          </div>
          <h3 className="font-bold text-xl text-gray-200">{title}</h3>
        </div>
        <span className={`px-3 py-1 text-sm font-bold rounded-full ${hasIssues ? 'bg-red-500/80 text-white' : 'bg-green-500/80 text-white'}`}>
          {count}
        </span>
      </div>
      {hasIssues ? (
        <div className="space-y-3">{children}</div>
      ) : (
        <p className="text-gray-400">No {title.toLowerCase()} found. Great job!</p>
      )}
    </div>
  );
};

export default SecurityDashboard;