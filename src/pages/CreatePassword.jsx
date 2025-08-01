import React, { useState } from 'react';
import { FiCopy, FiKey } from "react-icons/fi";
const PasswordGenerator = () => {
  const [length, setLength] = useState(12);
  const [lowerCount, setLowerCount] = useState(2);
  const [upperCount, setUpperCount] = useState(2);
  const [digitCount, setDigitCount] = useState(2);
  const [specialCount, setSpecialCount] = useState(2);
  const [password, setPassword] = useState('');

  const generatePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const totalSelected = lowerCount + upperCount + digitCount + specialCount;
    if (totalSelected > length) {
      alert(`Total selected characters (${totalSelected}) exceed password length (${length}).`);
      return;
    }

    const getRandomChars = (str, count) => {
      let result = '';
      for (let i = 0; i < count; i++) {
        result += str[Math.floor(Math.random() * str.length)];
      }
      return result;
    };

    let pwd = '';
    pwd += getRandomChars(lowercase, lowerCount);
    pwd += getRandomChars(uppercase, upperCount);
    pwd += getRandomChars(digits, digitCount);
    pwd += getRandomChars(special, specialCount);
    pwd += getRandomChars(lowercase + uppercase + digits + special, length - totalSelected); // filler

    // Shuffle password
    const shuffled = pwd
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');

    setPassword(shuffled);
  };
   const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
 

return (
  <div className='flex items-center justify-center min-h-screen bg-gradient-to-t from-black via-slate-800 to-black font-sans p-4'>
    <div className="w-full max-w-xl mx-auto p-8 bg-gray-800 text-gray-200 rounded-3xl shadow-2xl relative border border-gray-700 overflow-hidden">
      {/* Decorative Blur Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl absolute top-0 left-0 animate-blob"></div>
        <div className="w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl absolute bottom-0 right-0 animate-blob animation-delay-2000"></div>
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 space-y-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-green-400 drop-shadow-lg flex items-center justify-center gap-3">
          <FiKey className="inline text-purple-300 text-4xl"/> 
          Secure Password Generator
        </h2>
        
        <div className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="password-length" className="text-sm font-semibold mb-2 text-indigo-200">Password Length</label>
            <input
              id="password-length"
              type="number"
              min="4"
              max="100"
              value={length}
              onChange={e => setLength(parseInt(e.target.value))}
              className="w-full bg-gray-700 text-white border border-gray-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-700 p-4 rounded-xl transition duration-300 outline-none placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="lowercase-count" className="text-sm font-semibold mb-2 text-indigo-200">Lowercase Letters</label>
              <input
                id="lowercase-count"
                type="number"
                min="0"
                max="50"
                value={lowerCount}
                onChange={e => setLowerCount(parseInt(e.target.value))}
                className="w-full bg-gray-700 text-white border border-gray-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-700 p-4 rounded-xl transition duration-300 outline-none placeholder-gray-400"
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="uppercase-count" className="text-sm font-semibold mb-2 text-indigo-200">Uppercase Letters</label>
              <input
                id="uppercase-count"
                type="number"
                min="0"
                max="50"
                value={upperCount}
                onChange={e => setUpperCount(parseInt(e.target.value))}
                className="w-full bg-gray-700 text-white border border-gray-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-700 p-4 rounded-xl transition duration-300 outline-none placeholder-gray-400"
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="digits-count" className="text-sm font-semibold mb-2 text-indigo-200">Digits</label>
              <input
                id="digits-count"
                type="number"
                min="0"
                max="50"
                value={digitCount}
                onChange={e => setDigitCount(parseInt(e.target.value))}
                className="w-full bg-gray-700 text-white border border-gray-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-700 p-4 rounded-xl transition duration-300 outline-none placeholder-gray-400"
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="special-count" className="text-sm font-semibold mb-2 text-indigo-200">Special Characters</label>
              <input
                id="special-count"
                type="number"
                min="0"
                max="50"
                value={specialCount}
                onChange={e => setSpecialCount(parseInt(e.target.value))}
                className="w-full bg-gray-700 text-white border border-gray-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-700 p-4 rounded-xl transition duration-300 outline-none placeholder-gray-400"
              />
            </div>
          </div>

          <button
            onClick={generatePassword}
            className="w-full mt-4 flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-300 hover:from-green-700 hover:to-green-9  00 text-black  font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <FiKey className="text-2xl" />
            Generate Password
          </button>
        </div>

        {password && (
          <div className="mt-8 relative bg-gray-700 p-6 rounded-2xl text-center shadow-inner border border-gray-600 animate-fadeIn">
            <span className="font-mono text-2xl md:text-3xl font-light text-white break-all">{password}</span>
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 text-gray-400 hover:text-indigo-400 transition-colors duration-200"
              title="Copy to clipboard"
            >
              <FiCopy className="text-2xl" />
            </button>
            {copied && (
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-green-400 text-xs mt-2 animate-pulse-fade-in">
                Copied!
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);};
export default PasswordGenerator;