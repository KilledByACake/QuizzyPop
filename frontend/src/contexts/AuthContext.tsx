import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
  // Current JWT access token (null if not logged in)
  token: string | null;
  // Store token in state and localStorage
  login: (token: string) => void;
  // Clear token from state and localStorage
  logout: () => void;
  // Whether user is currently authenticated
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Authentication context provider
 * Manages JWT token storage and authentication state globally
 * Token persists in localStorage across page refreshes
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    // Load token from localStorage on mount
    return localStorage.getItem('token');
  });

   // Save token to localStorage and update state
   const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // Remove token from localStorage and clear state
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access authentication context
 * Must be used within AuthProvider
 * @throws Error if used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}