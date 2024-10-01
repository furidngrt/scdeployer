"use client";

import React, { useState, useEffect, useContext } from 'react';
import { DarkModeContext } from './components/DarkModeContext';
import ContractSelector from './components/ContractSelector';
import Deployer from './components/Deployer';
import { ethers } from 'ethers';
import { FaGithub, FaHeart, FaTwitter, FaMedium, FaFacebook, FaReddit } from 'react-icons/fa';
import Link from 'next/link';

import Token from './contracts/Token.json';
import SimpleStorage from './contracts/SimpleStorage.json';
import Crowdfunding from './contracts/Crowdfunding.json';
import NFTCreator from './contracts/NFTCreator.json';
import DAO from './contracts/DAO.json';
import ComplexStakingToken from './contracts/ComplexStakingToken.json';

const Home = () => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext);

  const contracts = [
    { name: 'Token', ...Token },
    { name: 'SimpleStorage', ...SimpleStorage },
    { name: 'Crowdfunding', ...Crowdfunding },
    { name: 'NFTCreator', ...NFTCreator },
    { name: 'DAO', ...DAO },
    { name: 'ComplexStakingToken', ...ComplexStakingToken },
  ];

  const [selectedContract, setSelectedContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const initializeConnection = async () => {
      if (window.ethereum && window.ethereum.selectedAddress) {
        await connectWallet();
      }
    };

    initializeConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', initializeConnection);
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', initializeConnection);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask is not installed');

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);

      setProvider(provider);
      setSigner(signer);
      setUserAddress(address);
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      alert(error.message || "An error occurred while connecting to MetaMask");
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setUserAddress(null);
    setBalance(null);
    setShowDropdown(false);
    console.log('Disconnected from MetaMask');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleScroll = () => {
    setShowScrollToTop(window.scrollY > 200);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1a1a2e]' : 'bg-[#f4f5f6]'} transition-colors duration-500 flex flex-col items-center`}>
      <header
        className={`w-full flex justify-between items-center py-4 px-4 border-b ${isDarkMode ? 'border-[#252a34]' : 'border-gray-300'}`}
        style={{ backgroundColor: isDarkMode ? '#252a34' : '#f4f5f6' }}
      >
        <div className="flex items-center space-x-4">
          <img 
            src="https://i.ibb.co.com/1mHFrTn/logo.png" 
            alt="Logo" 
            className="h-8 w-8 rounded-full" 
          />
          <nav className="flex space-x-4 text-gray-800">
            <Link href="/">
              <a 
                className={`hover:text-gray-100 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}
                style={linkStyle}
              >
                HOME
              </a>
            </Link>
            <Link href="/about">
              <a 
                className={`hover:text-gray-100 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}
                style={linkStyle}
              >
                ABOUT
              </a>
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={`flex items-center cursor-pointer p-1 ${isDarkMode ? 'bg-[#3f72af]' : 'bg-gray-300'} rounded-full`}
            onClick={toggleDarkMode}
            style={{ width: '40px', height: '20px' }}
          >
            <div
              className={`flex justify-center items-center w-5 h-5 rounded-full transition-transform transform ${isDarkMode ? 'translate-x-4 bg-gray-100' : 'translate-x-0 bg-blue-500'}`}
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </div>
          </div>
          {userAddress ? (
            <div className="relative">
              <span
                onClick={toggleDropdown}
                className={`text-white font-semibold py-2 px-3 rounded-xl shadow-md transition-transform transform hover:scale-105 text-xs cursor-pointer ${isDarkMode ? 'bg-[#4b6daa]' : 'bg-[#3b82f6]'}`}
              >
                {`${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`}
              </span>
              {showDropdown && (
                <div
                  className={`absolute right-0 mt-2 py-2 w-36 rounded-lg shadow-xl border ${isDarkMode ? 'bg-[#252a34] border-gray-700' : 'bg-white border-gray-300'}`}
                >
                  <button
                    onClick={disconnectWallet}
                    className={`block w-full px-4 py-2 text-left text-xs ${isDarkMode ? 'text-gray-100 hover:bg-[#3f72af] hover:text-gray-800' : 'text-gray-800 hover:bg-gray-200 hover:text-gray-900'}`}
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className={`text-white font-semibold py-2 px-3 rounded-xl shadow-md transition-transform transform hover:scale-105 text-xs ${isDarkMode ? 'bg-[#4b6daa]' : 'bg-[#3b82f6]'}`}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      <main className={`w-full max-w-lg mt-6 p-6 ${isDarkMode ? 'bg-[#252a34]' : 'bg-white'} rounded-lg shadow-lg`}>
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-4 text-center`}>
          Smart Contract Deployer
        </h2>

        <div className="space-y-6">
          <div className="w-full mx-auto">
            <ContractSelector
              contracts={contracts}
              onSelect={(index) => setSelectedContract(contracts[index])}
            />
          </div>

          {selectedContract && (
            <div className="w-full mx-auto">
              <p className={`text-center ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-3`}>
                Ensure your MetaMask is connected.
              </p>
              <Deployer
                contract={selectedContract}
                provider={provider}
                signer={signer}
                onDeploySuccess={(contractAddress) => {
                  addActivity(`Deployed contract at ${contractAddress}`);
                }}
              />
            </div>
          )}
        </div>
      </main>

      <div className="flex justify-center space-x-4 mt-6 mb-4">
        <SocialMediaLink href="https://twitter.com" icon={<FaTwitter />} isDarkMode={isDarkMode} />
        <SocialMediaLink href="https://medium.com" icon={<FaMedium />} isDarkMode={isDarkMode} />
        <SocialMediaLink href="https://facebook.com" icon={<FaFacebook />} isDarkMode={isDarkMode} />
        <SocialMediaLink href="https://reddit.com" icon={<FaReddit />} isDarkMode={isDarkMode} />
      </div>

      <footer className="w-full max-w-lg text-center py-4 mt-6">
        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <a 
            href="https://github.com/furidngrt/scdeployer"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center hover:text-blue-800 ${isDarkMode ? 'text-blue-400 hover:text-blue-600' : 'text-blue-600'}`}
          >
            <FaGithub className="mr-2" />
            View Source Code on GitHub
          </a>
        </p>
        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Deployer © 2024
          <span className="ml-2">
            Donations: 
            <a
              href="https://etherscan.io/address/0x010A565eD3F310586dd79cf4a4CE918E1Af73cdA"
              className={`text-blue-600 ${isDarkMode ? 'hover:text-blue-400' : 'hover:text-blue-800'} ml-2`}
            >
              0x010A...3cdA
            </a>
            <FaHeart className="inline-block ml-2 text-red-600" />
          </span>
        </div>
      </footer>
    </div>
  );
};

const linkStyle = {
  fontFamily: '"Inter Variable", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  fontSize: '14px',
  lineHeight: '20px',
  textAlign: 'start',
  letterSpacing: 'normal',
};

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-800 w-3 h-3">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-7.364l-.707-.707M6.343 18.343l-.707-.707m12.728 0l.707-.707M6.343 5.657l-.707-.707M15 12a3 3 0 01-6 0 3 3 0 016 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-100 w-3 h-3">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-7.364l-.707-.707M6.343 18.343l-.707-.707m12.728 0l.707-.707M6.343 5.657l-.707-.707M15 12a3 3 0 01-6 0 3 3 0 016 0z" />
  </svg>
);

const SocialMediaLink = ({ href, icon, isDarkMode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    <div className={`text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      {icon}
    </div>
  </a>
);

export default Home;
