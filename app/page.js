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
  const [gasPrice, setGasPrice] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]); // For activity feed

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

      // Fetch and set gas price
      const gasPrice = await provider.getGasPrice();
      setGasPrice(ethers.utils.formatUnits(gasPrice, 'gwei'));

      // Fetch and set recent transactions
      const blockNumber = await provider.getBlockNumber();
      const block = await provider.getBlockWithTransactions(blockNumber);
      setRecentTransactions(block.transactions.slice(0, 5)); // Show last 5 transactions
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
    setActivityFeed([]); // Clear activity feed on logout
    console.log('Logged out from MetaMask');
  };

  const formatBalance = (balance) => {
    return parseFloat(balance).toFixed(4);
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const addActivity = (activity) => {
    setActivityFeed((prevFeed) => [activity, ...prevFeed]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 flex flex-col items-center p-4">
      {/* Navbar with Connect/Logout Button */}
      <div className="w-full max-w-4xl flex justify-end mb-4">
        {userAddress ? (
          <div className="flex items-center space-x-2">
            <span className="bg-gray-200 text-gray-800 text-xs font-mono py-1 px-3 rounded-lg">
              Balance: {balance} ETH
            </span>
            <span className="bg-gray-200 text-gray-800 text-xs font-mono py-1 px-3 rounded-lg">
              {formatAddress(userAddress)}
            </span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-md shadow-md transition-transform transform hover:scale-105 text-xs"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-md shadow-md transition-transform transform hover:scale-105 text-xs"
          >
            Connect MetaMask
          </button>
        )}
      </div>

      <div className="text-center mb-10 mt-14 w-full max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-900 drop-shadow-lg mb-4">
          Smart Contract Deployer
        </h1>
        <p className="text-xs sm:text-sm text-blue-700">
          Seamlessly deploy your smart contracts with ease and security using our intuitive interface.
        </p>
      </div>

      <div className="w-full max-w-md sm:max-w-lg p-6 bg-white rounded-xl shadow-xl mb-12">
        <ContractSelector
          contracts={contracts}
          onSelect={(index) => setSelectedContract(contracts[index])}
        />
      </div>

      {selectedContract && (
        <div className="w-full max-w-md sm:max-w-lg p-6 bg-white rounded-xl shadow-xl mb-12">
          <p className="text-black mb-4">
            Ensure your MetaMask is connected and proceed with deployment.
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

      {/* Gas Price Section */}
      <div className="w-full max-w-md sm:max-w-lg p-4 bg-gray-200 rounded-xl shadow-xl mb-12">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Gas Price</h2>
        <p className="text-xs text-gray-700">Gas Price: {gasPrice} Gwei</p>
      </div>

      {/* Recent Transactions Section */}
      <div className="w-full max-w-md sm:max-w-lg p-4 bg-gray-200 rounded-xl shadow-xl mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h2>
        <ul className="text-xs text-gray-700 space-y-2">
          {recentTransactions.map((tx, index) => (
            <li key={index} className="p-2 bg-white rounded-md shadow-sm">
              <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Activity Feed Section */}
      {activityFeed.length > 0 && (
        <div className="w-full max-w-md sm:max-w-lg p-4 bg-gray-200 rounded-xl shadow-xl mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Activity Feed</h2>
          <ul className="text-xs text-gray-700 space-y-2">
            {activityFeed.map((activity, index) => (
              <li key={index} className="p-2 bg-white rounded-md shadow-sm">
                {activity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center py-4 mt-6">
        <p className="text-xs text-gray-600">
          &copy; {new Date().getFullYear()} Smart Contract Deployer. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
