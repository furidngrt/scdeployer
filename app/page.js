// app/page.js
"use client";

import React, { useState } from 'react';
import ContractSelector from './components/ContractSelector';
import Deployer from './components/Deployer';
import Token from './contracts/Token.json';
import SimpleStorage from './contracts/SimpleStorage.json';
import Crowdfunding from './contracts/Crowdfunding.json';
import YieldFarming from './contracts/YieldFarming.json';
import { ethers } from 'ethers';

const Home = () => {
  const contracts = [
    { name: 'Token', ...Token },
    { name: 'SimpleStorage', ...SimpleStorage },
    { name: 'Crowdfunding', ...Crowdfunding },
    { name: 'YieldFarming', ...YieldFarming },
  ];

  const [selectedContract, setSelectedContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [userAddress, setUserAddress] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setSigner(signer);
      setUserAddress(address);

      console.log('Wallet connected successfully');
      console.log('Connected Address:', address);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      alert(error.message || "An error occurred while connecting to MetaMask");
    }
  };

  const logout = () => {
    setProvider(null);
    setSigner(null);
    setUserAddress(null);
    console.log('Logged out from MetaMask');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 flex flex-col items-center p-4">
      {/* Navbar with Connect/Logout Button */}
      <div className="w-full max-w-4xl flex justify-end mb-4">
        {userAddress ? (
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Connect MetaMask
          </button>
        )}
      </div>

      <div className="text-center mb-8 w-full max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-900 drop-shadow-lg mb-4">
          Smart Contract Deployer
        </h1>
        <p className="text-md sm:text-lg text-blue-700">
          Seamlessly deploy your smart contracts with ease and security using our intuitive interface.
        </p>
      </div>

      <div className="w-full max-w-md sm:max-w-lg p-6 bg-white rounded-xl shadow-xl mb-8">
        {userAddress && (
          <div className="text-center mb-6">
            <p className="text-gray-700">Connected Address:</p>
            <p className="text-green-600 font-mono break-words">{userAddress}</p>
          </div>
        )}

        <ContractSelector
          contracts={contracts}
          onSelect={(index) => setSelectedContract(contracts[index])}
        />
      </div>

      {selectedContract && (
        <div className="w-full max-w-md sm:max-w-lg p-6 bg-white rounded-xl shadow-xl">          <p className="text-blue-700 mb-6">
            Ensure your MetaMask is connected and proceed with deployment.
          </p>
          <Deployer
            contract={selectedContract}
            provider={provider}
            signer={signer}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
