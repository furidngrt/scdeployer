"use client";

import React, { useState, useEffect } from 'react';
import ContractSelector from './components/ContractSelector';
import Deployer from './components/Deployer';
import Token from './contracts/Token.json';
import SimpleStorage from './contracts/SimpleStorage.json';
import Crowdfunding from './contracts/Crowdfunding.json';
import NFTCreator from './contracts/NFTCreator.json';
import DAO from './contracts/DAO.json';
import { ethers } from 'ethers';

const Home = () => {
  const contracts = [
    { name: 'Token', ...Token },
    { name: 'SimpleStorage', ...SimpleStorage },
    { name: 'Crowdfunding', ...Crowdfunding },
    { name: 'NFTCreator', ...NFTCreator },
    { name: 'DAO', ...DAO },
  ];

  const [selectedContract, setSelectedContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

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

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', initializeConnection);
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

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

  return (
    <div className="min-h-screen bg-[#f4f5f6] flex flex-col items-center">
      {/* Navbar */}
      <header
        className="w-full flex justify-between items-center py-4 border-b border-gray-300"
        style={{ backgroundColor: '#f4f5f6' }}
      >
        <div className="flex items-center space-x-4">
          <img 
            src="https://i.ibb.co.com/1mHFrTn/logo.png" 
            alt="Logo" 
            className="h-8 w-8 rounded-full ml-2" 
          />
          <nav className="flex space-x-4 text-gray-800">
            <a 
              href="#" 
              className="hover:text-black"
              style={{
                fontFamily: '"Inter Variable", -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
                fontSize: '16px',
                lineHeight: '24px',
                textAlign: 'start',
                letterSpacing: 'normal',
              }}
            >
              HOME
            </a>
          </nav>
        </div>
        {userAddress ? (
          <div className="relative mr-4"> {/* Added margin-right to match the Connect Wallet button */}
            <span
              onClick={toggleDropdown}
              className="bg-gray-200 text-black font-semibold py-2 px-4 rounded-xl shadow-md transition-transform transform hover:scale-105 text-sm cursor-pointer"
            >
              {`${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`}
            </span>
            {showDropdown && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white border rounded-lg shadow-xl">
                <button
                  onClick={disconnectWallet}
                  className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-gray-200 text-black font-semibold py-2 px-4 rounded-xl shadow-md transition-transform transform hover:scale-105 text-sm mr-4"
          >
            Connect Wallet
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl mt-10 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Smart Contract Deployer</h2>

        <div className="space-y-8">
          <div className="w-full max-w-md mx-auto">
            <ContractSelector
              contracts={contracts}
              onSelect={(index) => setSelectedContract(contracts[index])}
            />
          </div>

          {selectedContract && (
            <div className="w-full max-w-md mx-auto">
              <p className="text-black mb-4 text-center">
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

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center py-4 mt-6">
        <p className="text-xs text-gray-600">
          &copy; {new Date().getFullYear()} Smart Contract Deployer. All rights reserved.
        </p>
        <p className="text-xs text-gray-600">
          <a 
            href="https://github.com/furidngrt/smartcontract-deployer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            View Source Code on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Home;
