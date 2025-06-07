"use client";

import React from "react";
import { ToasterProvider } from "@/app/context/ToasterContext";

export function ToasterProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ToasterProvider>{children}</ToasterProvider>;
}
