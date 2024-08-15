"use client";

import React, { useContext } from 'react';
import { DarkModeContext } from '../components/DarkModeContext'; // Sesuaikan path jika perlu
import { FaGithub } from 'react-icons/fa'; // Import ikon GitHub
import Link from 'next/link'; // Import Link untuk navigasi

const About = () => {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <div className={`min-h-screen flex flex-col items-center ${isDarkMode ? 'bg-[#1a1a2e]' : 'bg-[#f4f5f6]'}`}>
      <header className={`w-full flex justify-between items-center py-4 px-4 border-b ${isDarkMode ? 'border-[#252a34]' : 'border-gray-300'}`}
        style={{ backgroundColor: isDarkMode ? '#252a34' : '#f4f5f6' }}>
        
        {/* Tombol Home */}
        <Link href="/" className={`text-sm font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} hover:underline`}>
          HOME
        </Link>

        <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          About This Application
        </h1>
      </header>
      <main className={`w-full max-w-2xl mt-6 p-6 ${isDarkMode ? 'bg-[#252a34]' : 'bg-white'} rounded-lg shadow-lg`}>
        <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-4`}>
          What is Smart Contract Deployer?
        </h2>
        <p className={`text-md ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          The Smart Contract Deployer is a web application that allows users to deploy various types of Ethereum smart contracts directly from the browser.
          With support for multiple contract types such as Token, Simple Storage, Crowdfunding, NFT Creator, and DAO, this application simplifies the deployment process by providing a user-friendly interface.
        </p>
        <p className={`text-md ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mt-4`}>
          Users can connect their MetaMask wallet, select a contract, and customize it with specific parameters before deploying it to the Ethereum network.
          The application is designed to be intuitive and efficient, making smart contract deployment accessible to everyone.
        </p>
        <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mt-6 mb-4`}>
          Features
        </h2>
        <ul className={`list-disc pl-5 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          <li>Connect MetaMask Wallet</li>
          <li>Select from multiple smart contract templates</li>
          <li>Customize contract parameters</li>
          <li>Deploy contracts directly from the browser</li>
          <li>Support for ERC20 Tokens, NFTs, DAOs, and more</li>
        </ul>
        <div className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <a
            href="https://github.com/furidngrt/scdeployer"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center hover:text-blue-800 ${isDarkMode ? 'text-blue-400 hover:text-blue-600' : 'text-blue-600'}`}
          >
            <FaGithub className="mr-2" />
            View Source Code on GitHub
          </a>
        </div>
      </main>
      <footer className="w-full max-w-lg text-center py-4 mt-6">
        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Deployer © 2024 - All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default About;
