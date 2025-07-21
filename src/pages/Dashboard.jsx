// pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import PasswordCard from "../components/Card";

const Dashboard = () => {
  const [passwords, setPasswords] = useState([]);

  useEffect(() => {
    // 👇 Replace this with actual Firebase call later
    const dummyData = [
      { site: "Facebook", username: "dhruvin123", password: "Fb@12345" },
      { site: "Gmail", username: "dhruvin.m", password: "Gm@12345" },
      { site: "Netflix", username: "moviebuff", password: "Nf@2025" },
    ];
    setPasswords(dummyData);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-sky-200 via-white to-sky-100 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-800 via-cyan-500 to-blue-500 drop-shadow-lg mb-10">
          🔐 Your Secure Passwords
        </h1>

        {passwords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3416/3416078.png"
              alt="No Passwords"
              className="w-24 opacity-60 mb-6 animate-pulse"
            />
            <p className="text-lg text-sky-600">No passwords saved yet!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {passwords.map((item, index) => (
              <PasswordCard
                key={index}
                site={item.site}
                username={item.username}
                password={item.password}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
