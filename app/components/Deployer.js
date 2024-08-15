"use client";

import React, { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { DarkModeContext } from './DarkModeContext';

const Deployer = ({ contract, provider, signer }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [deploying, setDeploying] = useState(false);
  const [contractAddress, setContractAddress] = useState('');
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [totalSupply, setTotalSupply] = useState('');
  const [nftName, setNftName] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const [nftImage, setNftImage] = useState(null);
  const [daoTokenAddress, setDaoTokenAddress] = useState('');
  const [hasGoalAndDuration, setHasGoalAndDuration] = useState(false);
  const [isTokenContract, setIsTokenContract] = useState(false);
  const [isNftContract, setIsNftContract] = useState(false);
  const [isDaoContract, setIsDaoContract] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (contract && contract.abi && contract.bytecode) {
      const hasGoal = contract.abi.some(
        (item) =>
          item.type === 'constructor' &&
          item.inputs.some((input) => input.name === '_goal')
      );
      const hasDuration = contract.abi.some(
        (item) =>
          item.type === 'constructor' &&
          item.inputs.some((input) => input.name === '_duration')
      );
      const isToken = contract.abi.some(
        (item) => item.name === 'totalSupply' && item.outputs.some((output) => output.internalType === 'uint256')
      );
      const isNft = contract.abi.some(
        (item) => item.name === 'createNFT' && item.inputs.some((input) => input.name === 'tokenURI')
      );
      const isDao = contract.abi.some(
        (item) => item.type === 'constructor' && item.inputs.some((input) => input.name === '_governanceToken')
      );

      setHasGoalAndDuration(hasGoal && hasDuration);
      setIsTokenContract(isToken);
      setIsNftContract(isNft);
      setIsDaoContract(isDao);
    } else {
      setHasGoalAndDuration(false);
      setIsTokenContract(false);
      setIsNftContract(false);
      setIsDaoContract(false);
    }
  }, [contract]);

  const deployContract = async () => {
    if (!provider) {
      alert('Please connect to MetaMask before deploying a contract.');
      return;
    }

    if (!signer || !contract || !contract.bytecode) {
      alert('Signer, contract data, or bytecode is missing.');
      return;
    }

    if (hasGoalAndDuration && (!goal || !duration)) {
      alert('Please enter goal and duration.');
      return;
    }

    if (isTokenContract && (!tokenName || !tokenSymbol || !totalSupply)) {
      alert('Please enter token name, symbol, and total supply.');
      return;
    }

    if (isNftContract && (!nftName || !nftDescription || !nftImage)) {
      alert('Please enter NFT name, description, and upload an image.');
      return;
    }

    if (isDaoContract && !daoTokenAddress) {
      alert('Please enter the governance token address.');
      return;
    }

    setDeploying(true);

    try {
      const factory = new ethers.ContractFactory(contract.abi, contract.bytecode, signer);

      let contractInstance;
      if (isTokenContract) {
        contractInstance = await factory.deploy(tokenName, tokenSymbol, totalSupply);
      } else if (hasGoalAndDuration) {
        contractInstance = await factory.deploy(goal, duration);
      } else if (isNftContract) {
        const tokenURI = `ipfs://your-ipfs-hash`; 
        contractInstance = await factory.deploy(nftName, tokenSymbol, tokenURI);
      } else if (isDaoContract) {
        contractInstance = await factory.deploy(daoTokenAddress);
      } else {
        contractInstance = await factory.deploy();
      }

      await contractInstance.deployed();

      setContractAddress(contractInstance.address);
      alert(`Contract deployed at address: ${contractInstance.address}`);
    } catch (error) {
      console.error("Deployment failed with error:", error);
      if (error.code === 4001) { // User rejected MetaMask request
        setErrorMessage("You rejected the MetaMask request. Please try again.");
      } else {
        setErrorMessage(error.message.length > 200 ? `${error.message.substring(0, 200)}...` : error.message);
      }
      setShowErrorPopup(true);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className={`relative p-4 ${isDarkMode ? 'bg-[#252a34] text-gray-100' : 'bg-white text-gray-800'} rounded-xl shadow-md space-y-4`}>
      {/* Conditional inputs based on contract type */}
      {hasGoalAndDuration && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>Goal</label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className={`mt-1 block w-full px-4 py-2 border ${isDarkMode ? 'bg-[#1a1a2e] text-gray-100 border-gray-700' : 'bg-gray-50 text-gray-800 border-gray-300'} rounded-lg`}
              placeholder="Enter goal amount"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>Duration</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className={`mt-1 block w-full px-4 py-2 border ${isDarkMode ? 'bg-[#1a1a2e] text-gray-100 border-gray-700' : 'bg-gray-50 text-gray-800 border-gray-300'} rounded-lg`}
              placeholder="Enter duration in seconds"
            />
          </div>
        </div>
      )}

      {isTokenContract && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>Token Name</label>
            <input
              type="text"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              className={`mt-1 block w-full px-4 py-2 border ${isDarkMode ? 'bg-[#1a1a2e] text-gray-100 border-gray-700' : 'bg-gray-50 text-gray-800 border-gray-300'} rounded-lg`}
              placeholder="Enter token name"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>Token Symbol</label>
            <input
              type="text"
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
              className={`mt-1 block w-full px-4 py-2 border ${isDarkMode ? 'bg-[#1a1a2e] text-gray-100 border-gray-700' : 'bg-gray-50 text-gray-800 border-gray-300'} rounded-lg`}
              placeholder="Enter token symbol"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>Total Supply</label>
            <input
              type="number"
              value={totalSupply}
              onChange={(e) => setTotalSupply(e.target.value)}
              className={`mt-1 block w-full px-4 py-2 border ${isDarkMode ? 'bg-[#1a1a2e] text-gray-100 border-gray-700' : 'bg-gray-50 text-gray-800 border-gray-300'} rounded-lg`}
              placeholder="Enter total supply"
            />
          </div>
        </div>
      )}

      {isNftContract && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>NFT Name</label>
            <input
              type="text"
              value={nftName}
              onChange={(e) => setNftName(e.target.value)}
              className={`mt-1 block w-full px-4 py-2 border ${isDarkMode ? 'bg-[#1a1a2e] text-gray-100 border-gray-700' : 'bg-gray-50 text-gray-800 border-gray-300'} rounded-lg`}
              placeholder="Enter NFT name"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>NFT Description</label>
            <textarea
              value={nftDescription}
              onChange={(e) => setNftDescription(e.target.value)}
              className={`mt-1 block w-full px-4 py-2 border ${isDarkMode ? 'bg-[#1a1a2e] text-gray-100 border-gray-700' : 'bg-gray-50 text-gray-800 border-gray-300'} rounded-lg`}
              placeholder="Enter NFT description"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>NFT Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNftImage(e.target.files[0])}
              className={`mt-1 block w-full px-4 py-2 border ${isDarkMode ? 'bg-[#1a1a2e] text-gray-100 border-gray-700' : 'bg-gray-50 text-gray-800 border-gray-300'} rounded-lg`}
            />
          </div>
        </div>
      )}

      {isDaoContract && (
        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>Governance Token Address</label>
          <input
            type="text"
            value={daoTokenAddress}
            onChange={(e) => setDaoTokenAddress(e.target.value)}
            className={`mt-1 block w-full px-4 py-2 border ${isDarkMode ? 'bg-[#1a1a2e] text-gray-100 border-gray-700' : 'bg-gray-50 text-gray-800 border-gray-300'} rounded-lg`}
            placeholder="Enter governance token address"
          />
        </div>
      )}

      <button
        onClick={deployContract}
        disabled={deploying || !contract || !contract.bytecode}
        className={`w-full mt-6 py-2 px-4 ${isDarkMode ? 'bg-[#3f72af] text-gray-100 hover:bg-[#2c5a9f]' : 'bg-blue-500 text-white hover:bg-blue-600'} rounded-full flex items-center justify-center`}
      >
        {deploying ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 2.042.602 3.944 1.635 5.518l2.365-1.227z"
              ></path>
            </svg>
            Deploying...
          </>
        ) : (
          'Deploy Contract'
        )}
      </button>

      {contractAddress && (
        <div className={`mt-4 p-4 ${isDarkMode ? 'bg-[#1a1a2e] text-gray-100' : 'bg-gray-100 text-gray-800'} rounded-lg`}>
          <h3 className="text-sm font-semibold">
            The contract has been deployed at:
          </h3>
          <p className="break-words text-sm">
            {contractAddress}
          </p>
        </div>
      )}

      {showErrorPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className={`bg-white ${isDarkMode ? 'bg-[#252a34] text-gray-100' : 'bg-white text-gray-800'} p-4 rounded-lg shadow-lg max-w-md w-full`}>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-red-500' : 'text-red-700'}`}>Error</h3>
            <p className="text-sm break-words">
              {errorMessage}
            </p>
            <button
              onClick={() => setShowErrorPopup(false)}
              className={`mt-4 w-full py-2 px-4 ${isDarkMode ? 'bg-red-700 text-gray-100 hover:bg-red-800' : 'bg-red-500 text-white hover:bg-red-600'} rounded-lg shadow-md`}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deployer;
