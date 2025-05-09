'use client';

import React from 'react';
import { ToasterProvider } from '../context/ToasterContext';

export function ToasterProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ToasterProvider>{children}</ToasterProvider>;
}