'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ToastStatus = 'pending' | 'success' | 'error';

export interface Toast {
  id: string;
  message: string;
  status: ToastStatus;
  txHash?: string;
  network?: string;
  createdAt: number;
  autoDismiss?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, status: ToastStatus, options?: { 
    txHash?: string;
    network?: string;
    autoDismiss?: number;
  }) => string;
  updateToast: (id: string, updates: Partial<Toast>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

// Helper to get explorer URL based on network
export const getExplorerUrl = (txHash: string, network: string = 'mainnet'): string => {
  const explorers: Record<string, string> = {
    mainnet: 'https://starkscan.co/tx/',
    testnet: 'https://testnet.starkscan.co/tx/',
    goerli: 'https://goerli.voyager.online/tx/',
    sepolia: 'https://sepolia.starkscan.co/tx/',
  };
  
  return `${explorers[network] || explorers.mainnet}${txHash}`;
};

export const useToastStore = create<ToastStore>()(
  persist(
    (set) => ({
      toasts: [],
      
      addToast: (message, status, options = {}) => {
        const id = crypto.randomUUID();
        const toast: Toast = {
          id,
          message,
          status,
          txHash: options.txHash,
          network: options.network || 'mainnet',
          createdAt: Date.now(),
          autoDismiss: options.autoDismiss,
        };
        
        set((state) => {
          const updatedToasts = [...state.toasts, toast].slice(-3);
          return { toasts: updatedToasts };
        });
        
        return id;
      },
      
      updateToast: (id, updates) => {
        set((state) => ({
          toasts: state.toasts.map((toast) => 
            toast.id === id ? { ...toast, ...updates } : toast
          ),
        }));
      },
      
      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        }));
      },
      
      clearToasts: () => {
        set({ toasts: [] });
      },
    }),
    {
      name: 'transaction-toasts',
      partialize: (state) => ({ 
        toasts: state.toasts.filter(toast => toast.status === 'pending') 
      }),
    }
  )
);