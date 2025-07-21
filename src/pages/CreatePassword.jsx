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
    <div className=" max-w-xl mx-auto p-8 mt-12 bg-white rounded-2xl shadow-2xl ring-1 ring-indigo-100 relative">
      {/* Decorative Gradient Bubble */}
      <div className="absolute -z-10 right-[-40px] top-[-40px] blur-2xl w-40 h-40 rounded-full bg-gradient-to-br from-indigo-200/40 to-indigo-100/0"></div>
      
      <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-indigo-700 flex justify-center items-center gap-2">
        <FiKey className="inline text-indigo-400 text-3xl" /> 
        Custom Password Generator
      </h2>
      
      <div className="space-y-8">
        <div>
          <label className="block font-semibold mb-1 text-indigo-800">Password Length</label>
          <input
            type="number"
            min="4"
            max="100"
            value={length}
            onChange={e => setLength(parseInt(e.target.value))}
            className="w-full border border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 p-3 rounded-lg transition outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-1 text-indigo-800">Lowercase Letters</label>
            <input
              type="number"
              min="0"
              max="50"
              value={lowerCount}
              onChange={e => setLowerCount(parseInt(e.target.value))}
              className="w-full border border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 p-3 rounded-lg transition outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-indigo-800">Uppercase Letters</label>
            <input
              type="number"
              min="0"
              max="50"
              value={upperCount}
              onChange={e => setUpperCount(parseInt(e.target.value))}
              className="w-full border border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 p-3 rounded-lg transition outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-indigo-800">Digits</label>
            <input
              type="number"
              min="0"
              max="50"
              value={digitCount}
              onChange={e => setDigitCount(parseInt(e.target.value))}
              className="w-full border border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 p-3 rounded-lg transition outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-indigo-800">Special Characters</label>
            <input
              type="number"
              min="0"
              max="50"
              value={specialCount}
              onChange={e => setSpecialCount(parseInt(e.target.value))}
              className="w-full border border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 p-3 rounded-lg transition outline-none"
            />
          </div>
        </div>

        <button
          onClick={generatePassword}
          className="w-full mt-1 flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-bold py-3 rounded-lg transition shadow-md active:scale-95 duration-150"
        >
          <FiKey className="text-xl" />
          Generate Password
        </button>

        {password && (
          <div className="mt-8 relative bg-gradient-to-tr from-indigo-50 via-white to-indigo-100 p-4 rounded-xl text-center shadow font-mono text-xl break-all flex flex-col items-center animate-fadeIn">
            <span>{password}</span>
            <button
              onClick={handleCopy}
              className="absolute right-4 top-3 inline-flex items-center text-indigo-400 hover:text-indigo-700 transition"
              title="Copy to clipboard"
            >
              <FiCopy className="text-xl" />
            </button>
            {copied && <span className="text-green-600 text-xs mt-2 animate-fadeIn">Copied!</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordGenerator;