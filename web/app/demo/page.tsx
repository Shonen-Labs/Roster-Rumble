'use client';

import React from 'react';
import { useToaster } from '../context/ToasterContext';

export default function DemoPage() {
  const { showToast, pendingTransactions } = useToaster();

  const simulateTransaction = (status: 'success' | 'error') => {

    setTimeout(() => {
      showToast(
        status === 'success' 
          ? 'Transaction confirmed!' 
          : 'Transaction failed.',
        status,
        { txHash: `0x${Math.random().toString(16).substring(2, 42)}` }
      );
    }, 3000);
  };

  const simulateMultipleToasts = () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        showToast(`Toast notification ${i + 1}`, 'success', {
          autoDismiss: 3000 
        });
      }, i * 1000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Toast System Demo</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Transaction Toasts</h2>
          <div className="space-x-4">
            <button
              onClick={() => simulateTransaction('success')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Simulate Successful Transaction
            </button>
            <button
              onClick={() => simulateTransaction('error')}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Simulate Failed Transaction
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Toast Limits</h2>
          <button
            onClick={simulateMultipleToasts}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Show Multiple Toasts (Max 3)
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Basic Toasts</h2>
          <div className="space-x-4">
            <button
              onClick={() => showToast('This is a pending toast', 'pending')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Show Pending
            </button>
            <button
              onClick={() => showToast('This is a success toast', 'success')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Show Success
            </button>
            <button
              onClick={() => showToast('This is an error toast', 'error')}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Show Error
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Custom Auto-Dismiss</h2>
          <div className="space-x-4">
            <button
              onClick={() => showToast('Disappears in 2 seconds', 'success', { autoDismiss: 2000 })}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              2 Second Dismiss
            </button>
            <button
              onClick={() => showToast('Will not auto-dismiss', 'success', { autoDismiss: 0 })}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              No Auto-Dismiss
            </button>
          </div>
        </div>

        {pendingTransactions.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Pending Transactions</h2>
            <ul className="space-y-2">
              {pendingTransactions.map(tx => (
                <li key={tx.id} className="p-3 bg-blue-50 rounded border border-blue-200">
                  {tx.message} - Transaction Hash: {tx.txHash?.substring(0, 10)}...
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}