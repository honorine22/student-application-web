"use client";

import "../../app/globals.css";
import { Toaster } from "sonner";

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <Toaster richColors position="top-right" closeButton />
    </>
  );
}
