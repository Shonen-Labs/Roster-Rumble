'use client';

import { useState, useCallback } from 'react';
import { useToaster } from '../context/ToasterContext';

interface TransactionOptions {
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
  network?: string;
}

export function useTransaction() {
  const { showToast, updateToast } = useToaster();
  const [isLoading, setIsLoading] = useState(false);

  const executeTransaction = useCallback(
    async (
      transactionFn: () => Promise<string>, // Function that returns transaction hash
      options: TransactionOptions = {}
    ) => {
      setIsLoading(true);
      const toastId = showToast('Processing transaction...', 'pending');

      try {
        const txHash = await transactionFn();

        updateToast(toastId, 'Transaction submitted', 'pending');
        
        await new Promise((resolve) => setTimeout(resolve, 2000));
    
        showToast('Transaction confirmed!', 'success', {
          txHash,
          network: options.network || 'mainnet'
        });
        
        options.onSuccess?.(txHash);
        return txHash;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Transaction failed');
        
        showToast(err.message, 'error');
        
        options.onError?.(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [showToast, updateToast]
  );

  return {
    executeTransaction,
    isLoading
  };
}