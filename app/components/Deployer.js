import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Deployer = ({ contract, provider, signer }) => {
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
  const [networkName, setNetworkName] = useState('');
  const [explorerLink, setExplorerLink] = useState('');
  const [hasGoalAndDuration, setHasGoalAndDuration] = useState(false);
  const [isTokenContract, setIsTokenContract] = useState(false);
  const [isNftContract, setIsNftContract] = useState(false);
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

      setHasGoalAndDuration(hasGoal && hasDuration);
      setIsTokenContract(isToken);
      setIsNftContract(isNft);
    } else {
      setHasGoalAndDuration(false);
      setIsTokenContract(false);
      setIsNftContract(false);
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
          default:
            explorerUrl = `https://${networkNameLower}.etherscan.io/address/`;
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

    if (isTokenContract && (!tokenName || !tokenSymbol || !totalSupply)) {
      alert('Please enter token name, symbol, and total supply.');
      return;
    }

    if (isNftContract && (!nftName || !nftDescription || !nftImage)) {
      alert('Please enter NFT name, description, and upload an image.');
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
        // In a real-world scenario, you would need to upload the image to a service like IPFS and get the URL
        const tokenURI = `ipfs://your-ipfs-hash`; // Replace with actual IPFS URL after upload
        contractInstance = await factory.deploy(nftName, tokenSymbol, tokenURI);
      } else {
        contractInstance = await factory.deploy();
      }

      await contractInstance.deployed();

      setContractAddress(contractInstance.address);
      alert(`Contract deployed at address: ${contractInstance.address} on ${networkName}`);
    } catch (error) {
      console.error("Deployment failed with error:", error);
      
      // Display the specific error message
      setErrorMessage(error.message);
      setShowErrorPopup(true);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="relative p-4 bg-white rounded-xl shadow-md space-y-4">
      {hasGoalAndDuration && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Goal</label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black bg-gray-100"
              placeholder="Enter goal amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black bg-gray-100"
              placeholder="Enter duration in seconds"
            />
          </div>
        </>
      )}

      {isTokenContract && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Token Name</label>
            <input
              type="text"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black bg-gray-100"
              placeholder="Enter token name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Token Symbol</label>
            <input
              type="text"
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black bg-gray-100"
              placeholder="Enter token symbol"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Supply</label>
            <input
              type="number"
              value={totalSupply}
              onChange={(e) => setTotalSupply(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black bg-gray-100"
              placeholder="Enter total supply"
            />
          </div>
        </>
      )}

      {isNftContract && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">NFT Name</label>
            <input
              type="text"
              value={nftName}
              onChange={(e) => setNftName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black bg-gray-100"
              placeholder="Enter NFT name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">NFT Description</label>
            <textarea
              value={nftDescription}
              onChange={(e) => setNftDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black bg-gray-100"
              placeholder="Enter NFT description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">NFT Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNftImage(e.target.files[0])}
              className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black bg-gray-100"
            />
          </div>
        </>
      )}

      <button
        onClick={deployContract}
        disabled={deploying || !contract || !contract.bytecode}
        className={`w-full py-2 px-4 bg-blue-200 text-blue-900 rounded-lg text-sm font-semibold transition-transform transform hover:scale-105 shadow-md flex justify-center items-center`}
      >
        {deploying ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-blue-900 mr-2"
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

      {showErrorPopup && (
        <div className="absolute top-0 left-0 right-0 flex justify-center p-4">
          <div className="bg-red-200 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{errorMessage}</span>
            <button
              onClick={() => setShowErrorPopup(false)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 5.652a.5.5 0 00-.708 0L10 9.293 6.36 5.652a.5.5 0 00-.707.708l3.64 3.64-3.64 3.64a.5.5 0 00.707.707l3.64-3.64 3.64 3.64a.5.5 0 00.708-.707l-3.64-3.64 3.64-3.64a.5.5 0 000-.708z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deployer;
