// app/page.js
"use client";

import React, { useState, useEffect } from 'react';
import ContractSelector from './components/ContractSelector';
import Deployer from './components/Deployer';
import Token from './contracts/Token.json';
import SimpleStorage from './contracts/SimpleStorage.json';
import Crowdfunding from './contracts/Crowdfunding.json';
import { ethers } from 'ethers';

const Home = () => {
  const contracts = [
    { name: 'Token', ...Token },
    { name: 'SimpleStorage', ...SimpleStorage },
    { name: 'Crowdfunding', ...Crowdfunding },
  ];

  const [selectedContract, setSelectedContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [balance, setBalance] = useState(null);

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
      setBalance(formatBalance(ethers.utils.formatEther(balance)));

      console.log('Wallet connected successfully');
      console.log('Connected Address:', address);
      console.log('Balance:', balance.toString());
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      alert(error.message || "An error occurred while connecting to MetaMask");
    }
  };

  const logout = () => {
    setProvider(null);
    setSigner(null);
    setUserAddress(null);
    setBalance(null);
    console.log('Logged out from MetaMask');
  };

  const formatBalance = (balance) => {
    return parseFloat(balance).toFixed(4);
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 flex flex-col items-center p-4">
      {/* Navbar with Connect/Logout Button */}
      <div className="w-full max-w-4xl flex justify-end mb-4">
        {userAddress ? (
          <div className="flex items-center space-x-2">
            <span className="bg-gray-200 text-gray-800 text-sm font-mono py-1 px-3 rounded-lg">
              Balance: {balance} ETH
            </span>
            <span className="bg-gray-200 text-gray-800 text-sm font-mono py-1 px-3 rounded-lg">
              {formatAddress(userAddress)}
            </span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-md shadow-md transition-transform transform hover:scale-105 text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-md shadow-md transition-transform transform hover:scale-105 text-sm"
          >
            Connect MetaMask
          </button>
        )}
      </div>

      <div className="text-center mb-12 mt-16 w-full max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 drop-shadow-lg mb-6">
          Smart Contract Deployer
        </h1>
        <p className="text-sm sm:text-md text-blue-700">
          Seamlessly deploy your smart contracts with ease and security using our intuitive interface.
        </p>
      </div>

      <div className="w-full max-w-md sm:max-w-lg p-6 bg-white rounded-xl shadow-xl mb-8">
        <ContractSelector
          contracts={contracts}
          onSelect={(index) => setSelectedContract(contracts[index])}
        />
      </div>

      {selectedContract && (
        <div className="w-full max-w-md sm:max-w-lg p-6 bg-white rounded-xl shadow-xl">
          <p className="text-blue-700 mb-6">
            Ensure your MetaMask is connected and proceed with deployment.
          </p>
          <Deployer
            contract={selectedContract}
            provider={provider}
            signer={signer}
          />
        </div>
      )}

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center py-4 mt-8">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Smart Contract Deployer. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
