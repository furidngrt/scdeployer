// app/components/ContractSelector.js
import React, { useState } from 'react';

const ContractSelector = ({ contracts, onSelect }) => {
  const [selectedContract, setSelectedContract] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedContract(value);
    onSelect(value);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto space-y-4 border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-900">
        Select a Smart Contract
      </h2>

      <div className="relative">
        <select
          value={selectedContract}
          onChange={handleChange}
          className="w-full bg-gray-100 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 block py-2 px-3 cursor-pointer appearance-none transition-transform transform hover:scale-105 shadow-sm"
        >
          <option value="">Select a contract</option>
          {contracts.map((contract, index) => (
            <option key={index} value={index}>
              {contract.name}
            </option>
          ))}
        </select>
      </div>

      <p className="text-gray-600 text-sm">
        Choose a smart contract from the dropdown menu to deploy it on the blockchain. Ensure all details are correct before proceeding.
      </p>
    </div>
  );
};

export default ContractSelector;
