'use client';

import React, { useEffect } from 'react';
import * as Toast from '@radix-ui/react-toast';
import { useToastStore, getExplorerUrl } from '../../lib/toastStore';
import { X as XIcon, Check as CheckIcon, RefreshCw as RefreshIcon, ExternalLink as ExternalLinkIcon } from 'lucide-react';

const DEFAULT_AUTO_DISMISS = 5000;

export const Toaster = () => {
  const { toasts, removeToast, updateToast } = useToastStore();

  // Set up auto-dismiss
  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.status !== 'pending' && (toast.autoDismiss !== 0)) {
        const timeout = setTimeout(() => {
          removeToast(toast.id);
        }, toast.autoDismiss || DEFAULT_AUTO_DISMISS);
        
        return () => clearTimeout(timeout);
      }
    });
  }, [toasts, removeToast]);

  const handleRetry = (toastId: string) => {
    // In a real app, you'd call your transaction function here
    updateToast(toastId, { status: 'pending' });
    
    // This is just for demo purposes
    setTimeout(() => {
      const success = Math.random() > 0.5;
      updateToast(toastId, { 
        status: success ? 'success' : 'error',
        message: success ? 'Transaction successful!' : 'Transaction failed. Try again?'
      });
    }, 2000);
  };

  return (
    <Toast.Provider>
      <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 max-w-xs w-full">
        {toasts.map((toast) => (
          <Toast.Root 
            key={toast.id}
            className={`flex items-center gap-2 p-4 rounded-md shadow-lg ${
              toast.status === 'pending' ? 'bg-blue-50 border border-blue-200' :
              toast.status === 'success' ? 'bg-green-50 border border-green-200' :
              'bg-red-50 border border-red-200'
            }`}
            open={true}
            onOpenChange={(open) => {
              if (!open) removeToast(toast.id);
            }}
          >
            <div className="flex-shrink-0">
              {toast.status === 'pending' && (
                <div className="animate-spin w-5 h-5">
                  <div className="h-5 w-5 rounded-full border-2 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent" />
                </div>
              )}
              {toast.status === 'success' && <CheckIcon className="w-5 h-5 text-green-500" />}
              {toast.status === 'error' && <XIcon className="w-5 h-5 text-red-500" />}
            </div>
            
            <Toast.Description className="flex-grow text-sm">
              {toast.message}
            </Toast.Description>
            
            <div className="flex gap-1">
              {toast.status === 'error' && (
                <button 
                  onClick={() => handleRetry(toast.id)}
                  className="p-1 rounded hover:bg-red-100"
                  aria-label="Retry transaction"
                >
                  <RefreshIcon className="w-4 h-4" />
                </button>
              )}
              
              {toast.status === 'success' && toast.txHash && (
                <a 
                  href={getExplorerUrl(toast.txHash, toast.network)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded hover:bg-green-100"
                  aria-label="View on Starkscan"
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                </a>
              )}
              
              <button 
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded hover:bg-gray-100"
                aria-label="Close"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          </Toast.Root>
        ))}
        
        <Toast.Viewport />
      </div>
    </Toast.Provider>
  );
};