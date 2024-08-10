// app/components/Deployer.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Deployer = ({ contract, provider, signer }) => {
  const [deploying, setDeploying] = useState(false);
  const [contractAddress, setContractAddress] = useState('');
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('');
  const [networkName, setNetworkName] = useState('');
  const [explorerLink, setExplorerLink] = useState('');
  const [hasGoalAndDuration, setHasGoalAndDuration] = useState(false);

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

      setHasGoalAndDuration(hasGoal && hasDuration);
    } else {
      setHasGoalAndDuration(false);
    }

    if (provider) {
      provider.getNetwork().then((network) => {
        setNetworkName(network.name);

        let explorerUrl;
        const networkNameLower = network.name.toLowerCase();

        switch (networkNameLower) {
          case 'homestead': // Mainnet
            explorerUrl = 'https://etherscan.io/address/';
            break;
          case 'ropsten':
            explorerUrl = 'https://ropsten.etherscan.io/address/';
            break;
          case 'rinkeby':
            explorerUrl = 'https://rinkeby.etherscan.io/address/';
            break;
          case 'sepolia':
            explorerUrl = 'https://sepolia.etherscan.io/address/';
            break;
          case 'kovan':
            explorerUrl = 'https://kovan.etherscan.io/address/';
            break;
          case 'beratrail': // Custom network example
            explorerUrl = 'https://bartio.beratrail.io/address/';
            break;
          default:
            if (networkNameLower.includes('mainnet')) {
              explorerUrl = `https://etherscan.io/address/`;
            } else if (networkNameLower.includes('testnet')) {
              explorerUrl = `https://${networkNameLower}.etherscan.io/address/`;
            } else {
              explorerUrl = `https://explorer.${networkNameLower}.io/address/`;
            }
        }

        setExplorerLink(explorerUrl);
      });
    }
  }, [contract, provider]);

  const deployContract = async () => {
    if (!provider) {
      alert('Please connect to MetaMask before deploying a contract.');
      return;
    }

    if (!signer || !contract || !contract.bytecode) {
      alert('Signer, contract data, or bytecode is missing.');
      console.log('Signer:', signer);
      console.log('Contract:', contract);
      return;
    }

    if (hasGoalAndDuration && (!goal || !duration)) {
      alert('Please enter goal and duration.');
      return;
    }

    setDeploying(true);

    try {
      const factory = new ethers.ContractFactory(contract.abi, contract.bytecode, signer);
      const contractInstance = hasGoalAndDuration
        ? await factory.deploy(goal, duration)
        : await factory.deploy();

      await contractInstance.deployed();

      setContractAddress(contractInstance.address);
      alert(`Contract deployed at address: ${contractInstance.address} on ${networkName}`);
    } catch (error) {
      console.error("Deployment failed with error:", error);
      alert(`Deployment failed: ${error.message}`);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md space-y-4">
      {hasGoalAndDuration && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Goal</label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter goal amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter duration in seconds"
            />
          </div>
        </>
      )}

      <button
        onClick={deployContract}
        disabled={deploying || !contract || !contract.bytecode}
        className={`w-full py-2 px-3 rounded-lg text-white font-semibold text-sm ${
          deploying ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
        } transition-transform transform hover:scale-105 shadow-md flex justify-center items-center`}
      >
        {deploying ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-white mr-2"
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
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-800">Contract Deployed!</h3>
          <p className="text-gray-700 break-words text-sm">
            The contract has been deployed at:{" "}
            <a
              href={`${explorerLink}${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {contractAddress}
            </a>{" "}
            on {networkName}
          </p>
        </div>
      )}
    </div>
  );
};

export default Deployer;
