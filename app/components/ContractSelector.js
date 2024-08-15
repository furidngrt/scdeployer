"use client";

import React, { useState, useContext } from 'react';
import { DarkModeContext } from './DarkModeContext';

const ContractSelector = ({ contracts, onSelect }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [selectedContract, setSelectedContract] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedContract(value);
    onSelect(value);
  };

  return (
    <div className={`p-4 ${isDarkMode ? 'bg-[#252a34] text-gray-100' : 'bg-white text-gray-800'} rounded-lg shadow-md max-w-md mx-auto space-y-3 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <h3 className="text-xl font-medium">
        Select a Smart Contract
      </h3>

      <div className="relative">
        <select
          value={selectedContract}
          onChange={handleChange}
          className={`w-full ${isDarkMode ? 'bg-[#1a1a2e] text-gray-100' : 'bg-gray-100 text-gray-900'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} rounded-lg block py-2 px-2 cursor-pointer appearance-none`}
          style={{ zIndex: 1000, position: 'relative' }}
        >
          <option value="">Select a contract</option>
          {contracts.map((contract, index) => (
            <option key={index} value={index}>
              {contract.name}
            </option>
          ))}
        </select>
      </div>

      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Choose a smart contract from the dropdown menu to deploy it on the blockchain. Ensure all details are correct before proceeding.
      </p>
    </div>
  );
};

export default ContractSelector;
