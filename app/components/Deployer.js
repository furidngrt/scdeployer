// app/components/Deployer.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Deployer = ({ contract, provider, signer }) => {
  const [deploying, setDeploying] = useState(false);
  const [contractAddress, setContractAddress] = useState('');

  useEffect(() => {
    console.log('Signer in Deployer:', signer);
    console.log('Contract in Deployer:', contract);
  }, [signer, contract]);

  const deployContract = async () => {
    if (!provider) {
      alert('Please connect to MetaMask before deploying a contract.');
      return;
    }

    if (!signer || !contract) {
      alert('Signer or contract data is missing.');
      console.log('Signer:', signer);
      console.log('Contract:', contract);
      return;
    }

    setDeploying(true);

    try {
      console.log('Contract ABI:', contract.abi);
      console.log('Contract Bytecode:', contract.bytecode);

      console.log('Creating contract factory...');
      const factory = new ethers.ContractFactory(contract.abi, contract.bytecode, signer);

      console.log('Deploying contract...');
      const contractInstance = await factory.deploy();

      await contractInstance.deployed();

      console.log('Contract deployed at:', contractInstance.address);
      setContractAddress(contractInstance.address);
      alert(`Contract deployed at address: ${contractInstance.address}`);
    } catch (error) {
      console.error("Deployment failed with error:", error);
      alert(`Deployment failed: ${error.message}`);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 rounded-xl shadow-lg space-y-6 max-w-lg mx-auto">

      <button
        onClick={deployContract}
        disabled={deploying || !contract}
        className={`w-full py-3 px-4 rounded-lg text-white font-semibold ${
          deploying ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        } transition-transform transform hover:scale-105 shadow-lg`}
      >
        {deploying ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white inline-block mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v1m0 14v1m7-7h1m-14 0H4m1-5l1 1m12 12l1 1M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42"
              />
            </svg>
            Deploying...
          </>
        ) : (
          'Deploy Contract'
        )}
      </button>

      {contractAddress && (
        <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800">Contract Deployed Successfully!</h3>
          <p className="text-gray-700 mt-2">
            Your contract has been deployed at: <span className="text-blue-600">{contractAddress}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Deployer;
