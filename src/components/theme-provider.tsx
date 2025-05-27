
"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useTheme as useSystemTheme } from '@/hooks/use-theme'; // Renamed to avoid conflict

type Theme = 'light' | 'dark';

interface ThemeProviderContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, setTheme, toggleTheme } = useSystemTheme();

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = (): ThemeProviderContextType => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
