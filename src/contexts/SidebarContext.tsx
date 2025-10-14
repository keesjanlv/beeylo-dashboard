'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SidebarPosition = 'left' | 'top' | 'bottom';

interface SidebarContextType {
  position: SidebarPosition;
  setPosition: (position: SidebarPosition) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [position, setPositionState] = useState<SidebarPosition>('left');

  // Load position from localStorage on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem('sidebar-position') as SidebarPosition;
    if (savedPosition && ['left', 'top', 'bottom'].includes(savedPosition)) {
      setPositionState(savedPosition);
    }
  }, []);

  // Save position to localStorage when it changes
  const setPosition = (newPosition: SidebarPosition) => {
    setPositionState(newPosition);
    localStorage.setItem('sidebar-position', newPosition);
  };

  return (
    <SidebarContext.Provider value={{ position, setPosition }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}