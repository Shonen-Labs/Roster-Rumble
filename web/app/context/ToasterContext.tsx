"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useToastStore, ToastStatus } from "../../lib/toastStore";
import { Toaster } from "@/components/Toaster";

interface ToasterContextValue {
  showToast: (
    message: string,
    status: ToastStatus,
    options?: {
      txHash?: string;
      network?: string;
      autoDismiss?: number;
    }
  ) => string;
  updateToast: (id: string, message: string, status: ToastStatus) => void;
  dismissToast: (id: string) => void;
  pendingTransactions: Array<{
    id: string;
    message: string;
    txHash?: string;
    network?: string;
  }>;
}

const ToasterContext = createContext<ToasterContextValue | undefined>(
  undefined
);

export const ToasterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    toasts,
    addToast,
    updateToast: updateStoreToast,
    removeToast,
  } = useToastStore();

  const showToast = (message: string, status: ToastStatus, options = {}) => {
    return addToast(message, status, options);
  };

  const updateToast = (id: string, message: string, status: ToastStatus) => {
    updateStoreToast(id, { message, status });
  };

  const dismissToast = (id: string) => {
    removeToast(id);
  };

  const pendingTransactions = toasts
    .filter((toast) => toast.status === "pending" && toast.txHash)
    .map((toast) => ({
      id: toast.id,
      message: toast.message,
      txHash: toast.txHash,
      network: toast.network,
    }));

  return (
    <ToasterContext.Provider
      value={{ showToast, updateToast, dismissToast, pendingTransactions }}
    >
      {children}
      <Toaster />
    </ToasterContext.Provider>
  );
};

export const useToaster = (): ToasterContextValue => {
  const context = useContext(ToasterContext);
  if (context === undefined) {
    throw new Error("useToaster must be used within a ToasterProvider");
  }
  return context;
};
