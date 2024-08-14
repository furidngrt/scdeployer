import React, { useState } from 'react';

const ContractSelector = ({ contracts, onSelect }) => {
  const [selectedContract, setSelectedContract] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedContract(value);
    onSelect(value);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto space-y-3 border border-gray-200">
      <h3 className="text-xl font-medium text-gray-900">
        Select a Smart Contract
      </h3>

      <div className="relative">
        <select
          value={selectedContract}
          onChange={handleChange}
          className="w-full bg-gray-100 text-gray-900 border border-gray-300 rounded-lg block py-2 px-2 cursor-pointer appearance-none"
          style={{ zIndex: 1000, position: 'relative' }} // Ensure visibility
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
