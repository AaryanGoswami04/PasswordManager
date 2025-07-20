import React, { useState } from 'react';

const generatePassword = (length, upper, lower, digits, special) => {
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const digitChars = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const getRandom = (chars, count) =>
    Array.from({ length: count }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

  const total = upper + lower + digits + special;
  if (total > length) return 'Length too short for selected character counts.';

  let password =
    getRandom(upperChars, upper) +
    getRandom(lowerChars, lower) +
    getRandom(digitChars, digits) +
    getRandom(specialChars, special);

  const remaining = length - total;
  const allChars = upperChars + lowerChars + digitChars + specialChars;
  password += getRandom(allChars, remaining);

  return [...password].sort(() => Math.random() - 0.5).join('');
};

const CreatePassword = () => {
  const [options, setOptions] = useState({
    length: 8,
    upper: 2,
    lower: 2,
    digits: 2,
    special: 2,
  });

  const [password, setPassword] = useState('');

  const handleChange = (e) => {
    setOptions({
      ...options,
      [e.target.name]: parseInt(e.target.value) || 0,
    });
  };

  const handleGenerate = () => {
    const { length, upper, lower, digits, special } = options;
    const result = generatePassword(length, upper, lower, digits, special);
    setPassword(result);
  };

 return (
  <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center px-6">
    <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-emerald-400/20 max-w-md w-full p-10 sm:p-12">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-emerald-300 drop-shadow">
        🔧 Create Strong Password
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { label: "Length", name: "length", min: 1 },
          { label: "Uppercase", name: "upper", min: 0 },
          { label: "Lowercase", name: "lower", min: 0 },
          { label: "Digits", name: "digits", min: 0 },
          { label: "Special", name: "special", min: 0 }
        ].map(({label, name, min}) => (
          <div key={name}>
            <label className="block text-xs font-bold text-gray-200 mb-1 tracking-wide">{label}</label>
            <input
              type="number"
              name={name}
              value={options[name]}
              onChange={handleChange}
              min={min}
              className="w-full px-3 py-2 rounded-md bg-gray-800/80 border border-emerald-500/20 text-white placeholder-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleGenerate}
        className="w-full bg-gradient-to-r from-emerald-500 via-sky-600 to-indigo-500 hover:from-emerald-400 hover:to-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg text-lg tracking-wide transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
      >
        Generate Password
      </button>

      {password && (
        <div className="mt-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-emerald-500/30 text-emerald-300 text-base font-mono font-semibold rounded-xl p-4 text-center tracking-wider selection:bg-emerald-400/40 break-words relative">
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs px-2 py-0.5 bg-emerald-600/80 rounded-full text-white shadow-md tracking-wider">
            Generated Password
          </span>
          <span>{password}</span>
        </div>
      )}
    </div>
  </div>
);

};

export default CreatePassword;
