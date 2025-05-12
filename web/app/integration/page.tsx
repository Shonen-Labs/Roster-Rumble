'use client';

import React from 'react';
import { useTransaction } from '../hooks/useTransaction';
import { useToaster } from '../context/ToasterContext';

export default function IntegrationTest() {
  const { isLoading, executeTransaction } = useTransaction();
  const { pendingTransactions } = useToaster();

  // Mock blockchain transaction function
  const mockTransaction = async () => {
    // Simulate blockchain call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 20% chance of failure to test error handling
    if (Math.random() < 0.2) {
      throw new Error("Transaction rejected: insufficient funds");
    }
    
    // Return mock transaction hash
    return `0x${Math.random().toString(16).substring(2, 42)}`;
  };

  const handleTransactionClick = async () => {
    try {
      await executeTransaction(mockTransaction, {
        network: 'mainnet',
        onSuccess: (txHash) => {
          console.log(`Transaction successful: ${txHash}`);
        },
        onError: (error) => {
          console.error(`Transaction failed: ${error.message}`);
        }
      });
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Integration Test</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Test Transaction Flow</h2>
        <button
          onClick={handleTransactionClick}
          disabled={isLoading}
          className={`px-4 py-2 rounded text-white ${
            isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isLoading ? 'Processing...' : 'Execute Transaction'}
        </button>
      </div>
      
      {pendingTransactions.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Pending Transactions</h2>
          <ul className="space-y-2">
            {pendingTransactions.map(tx => (
              <li key={tx.id} className="p-3 bg-blue-50 rounded border border-blue-200">
                {tx.message} - Hash: {tx.txHash?.substring(0, 10)}...
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-gray-100 p-4 mt-6 rounded">
        <h3 className="font-medium mb-2">Testing Instructions:</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Click Execute Transaction to start a mock transaction</li>
          <li>Observe the pending toast with spinner</li>
          <li>Wait for transaction to complete (success or error)</li>
          <li>Try refreshing the page while a transaction is pending</li>
          <li>Click the transaction link in success toasts</li>
          <li>Click retry on error toasts</li>
        </ol>
      </div>
    </div>
  );
}