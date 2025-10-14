'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface FocusContextType {
  focusMode: boolean;
  setFocusMode: (value: boolean) => void;
  toggleFocusMode: () => void;
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export function FocusProvider({ children }: { children: ReactNode }) {
  const [focusMode, setFocusModeState] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('focus-mode');
    if (saved) {
      setFocusModeState(saved === 'true');
    }
  }, []);

  const setFocusMode = (value: boolean) => {
    setFocusModeState(value);
    localStorage.setItem('focus-mode', String(value));
  };

  const toggleFocusMode = () => setFocusMode(!focusMode);

  return (
    <FocusContext.Provider value={{ focusMode, setFocusMode, toggleFocusMode }}>
      {children}
    </FocusContext.Provider>
  );
}

export function useFocus() {
  const ctx = useContext(FocusContext);
  if (!ctx) throw new Error('useFocus must be used within a FocusProvider');
  return ctx;
}