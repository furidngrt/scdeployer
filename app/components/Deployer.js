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
        (item) =>
          item.name === 'totalSupply' &&
          item.outputs.some((output) => output.internalType === 'uint256')
      );
      const isNft = contract.abi.some(
        (item) =>
          item.name === 'createNFT' &&
          item.inputs.some((input) => input.name === 'tokenURI')
      );
      const isDao = contract.abi.some(
        (item) =>
          item.type === 'constructor' &&
          item.inputs.some((input) => input.name === '_governanceToken')
      );

      setHasGoalAndDuration(hasGoal && hasDuration);
      setIsTokenContract(isToken);
      setIsNftContract(isNft);
      setIsDaoContract(isDao);
    } else {
      resetContractFlags();
    }
  }, [contract]);

  const resetContractFlags = () => {
    setHasGoalAndDuration(false);
    setIsTokenContract(false);
    setIsNftContract(false);
    setIsDaoContract(false);
  };

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
      handleDeploymentError(error);
    } finally {
      setDeploying(false);
    }
  };

  const handleDeploymentError = (error) => {
    console.error("Deployment failed with error:", error);
    const message = error.code === 4001
      ? "You rejected the MetaMask request. Please try again."
      : error.message.length > 200
      ? `${error.message.substring(0, 200)}...`
      : error.message;

    setErrorMessage(message);
    setShowErrorPopup(true);
  };

  return (
    <div className={`relative p-4 ${isDarkMode ? 'bg-[#252a34] text-gray-100' : 'bg-white text-gray-800'} rounded-xl shadow-md space-y-4`}>
      {renderContractInputs()}
      <button
        onClick={deployContract}
        disabled={deploying || !contract || !contract.bytecode}
        className={`w-full mt-6 py-2 px-4 ${isDarkMode ? 'bg-[#3f72af] text-gray-100 hover:bg-[#2c5a9f]' : 'bg-blue-500 text-white hover:bg-blue-600'} rounded-full flex items-center justify-center`}
      >
        {deploying ? renderDeployingSpinner() : 'Deploy Contract'}
      </button>

      {contractAddress && renderContractAddress()}

      {showErrorPopup && renderErrorPopup()}
    </div>
  );

  function renderContractInputs() {
    return (
      <>
        {hasGoalAndDuration && renderGoalAndDurationInputs()}
        {isTokenContract && renderTokenInputs()}
        {isNftContract && renderNftInputs()}
        {isDaoContract && renderDaoInput()}
      </>
    );
  }

  function renderGoalAndDurationInputs() {
    return (
      <div className="space-y-4">
        {renderInput('Goal', goal, setGoal, 'number')}
        {renderInput('Duration', duration, setDuration, 'number', 'Enter duration in seconds')}
      </div>
    );
  }

  function renderTokenInputs() {
    return (
      <div className="space-y-4">
        {renderInput('Token Name', tokenName, setTokenName)}
        {renderInput('Token Symbol', tokenSymbol, setTokenSymbol)}
        {renderInput('Total Supply', totalSupply, setTotalSupply, 'number')}
      </div>
    );
  }

  function renderNftInputs() {
    return (
      <div className="space-y-4">
        {renderInput('NFT Name', nftName, setNftName)}
        {renderTextArea('NFT Description', nftDescription, setNftDescription)}
        {renderFileInput('NFT Image', nftImage, setNftImage)}
      </div>
    );
  }

  function renderDaoInput() {
    return renderInput('Governance Token Address', daoTokenAddress, setDaoTokenAddress);
  }

  function renderInput(label, value, setter, type = 'text', placeholder = '') {
    return (
      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>{label}</label>
        <input
          type={type}
          value={value}
          onChange={(e) => setter(e.target.value)}
          className={`mt-1 block w-full px-4 py-2 border ${isDarkMode ? 'bg-[#1a1a2e] text-gray-100 border-gray-700' : 'bg-gray-50 text-gray-800 border-gray-300'} rounded-lg`}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        />
      </div>
    );
  }

  function renderTextArea(label, value, setter) {
    return (
      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>{label}</label>
        <textarea
          value={value}
          onChange={(e) => setter(e.target.value)}
          className={`mt-1 block w-full px-4 py-2 border ${isDarkMode ? 'bg-[#1a1a2e] text-gray-100 border-gray-700' : 'bg-gray-50 text-gray-800 border-gray-300'} rounded-lg`}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      </div>
    );
  }

  function renderFileInput(label, value, setter) {
    return (
      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>{label}</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setter(e.target.files[0])}
          className={`mt-1 block w-full px-4 py-2 border ${isDarkMode ? 'bg-[#1a1a2e] text-gray-100 border-gray-700' : 'bg-gray-50 text-gray-800 border-gray-300'} rounded-lg`}
        />
      </div>
    );
  }

  function renderDeployingSpinner() {
    return (
      <>
        <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 2.042.602 3.944 1.635 5.518l2.365-1.227z"></path>
        </svg>
        Deploying...
      </>
    );
  }

  function renderContractAddress() {
    return (
      <div className={`mt-4 p-4 ${isDarkMode ? 'bg-[#1a1a2e] text-gray-100' : 'bg-gray-100 text-gray-800'} rounded-lg`}>
        <h3 className="text-sm font-semibold">The contract has been deployed at:</h3>
        <p className="break-words text-sm">{contractAddress}</p>
      </div>
    );
  }

  function renderErrorPopup() {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <div className={`p-4 rounded-lg shadow-lg max-w-md w-full ${isDarkMode ? 'bg-[#252a34] text-gray-100' : 'bg-white text-gray-800'}`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
            Error
          </h3>
          <p className="text-sm break-words">
            {errorMessage}
          </p>
          <button
            onClick={() => setShowErrorPopup(false)}
            className={`mt-4 w-full py-2 px-4 rounded-lg shadow-md transition-colors duration-300 ${isDarkMode ? 'bg-red-600 text-gray-100 hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600'}`}
          >
            OK
          </button>
        </div>
      </div>
    );
  }
};

export default Deployer;
