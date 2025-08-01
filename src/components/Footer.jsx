import React from "react";
import { FaGithub } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
const Footer = () => {
 return (
  <footer className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-950  text-white py-7 border-t border-emerald-700/30 shadow-inner backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-[15px] text-center md:text-left tracking-wide select-none">
        © {new Date().getFullYear()} <span className="text-emerald-400 font-bold">VaultX</span>. All rights reserved.
      </p>
      <div className="flex gap-7 items-center text-base">
        <a
          href="https://github.com/dhruvin2968"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-emerald-400 transition font-medium"
        >
          <FaGithub size={18} className="opacity-75" />
          GitHub
        </a>
        <a
          href="mailto:dhruvindmehta@gmail.com"
          className="flex items-center gap-1 hover:text-emerald-400 transition font-medium"
        >
          <HiOutlineMail size={18} className="opacity-80" />
          Contact
        </a>
       
      </div>
    </div>
  </footer>
);
};

export default Footer;
