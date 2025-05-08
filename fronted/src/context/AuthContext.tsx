// Fronted/src/context/AuthContext.tsx
'use client';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import * as api from '../utils/api';
import { WooCommerceCustomer } from '../utils/types';

interface AuthContextType {
  user: WooCommerceCustomer | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: WooCommerceCustomer; message?: string }>;
  register: (username: string, first_name: string, last_name: string, email: string, password: string) => Promise<{ success: boolean; user?: WooCommerceCustomer; message?: string }>;
  logout: () => void;
  updateUser: (details: WooCommerceCustomer) => void;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<WooCommerceCustomer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setToken(localStorage.getItem('token'));

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
        localStorage.removeItem('user'); // Clear corrupted data
      }
    }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      
      // Handle successful login
      if ('user' in response && 'token' in response) {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        return { success: true, user: response.user };
      }
      
      // Handle error response
      return { 
        success: false, 
        message: response.message || 'Login failed' 
      };
    } catch (error) {
      console.error('Auth context login error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unexpected error occurred' 
      };
    }
  };

  const register = async (username: string, first_name: string, last_name: string, email: string, password: string) => {
    try {
      const response = await api.register(username, first_name, last_name, email, password);
      
      // Handle successful registration
      if ('user' in response && 'token' in response) {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        return { success: true, user: response.user };
      }
      
      // Handle error response
      return { 
        success: false, 
        message: response.message || 'Registration failed' 
      };
    } catch (error) {
      console.error('Auth context register error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unexpected error occurred' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
  };

  const updateUser = (details: WooCommerceCustomer) => {
    setUser(details);
  };

  const requestPasswordReset = async (email: string) => {
    await api.requestPasswordReset(email);
  };

  const resetPassword = async (token: string, newPassword: string) => {
    await api.resetPassword({ token, newPassword, email: user?.email || '' });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        requestPasswordReset,
        resetPassword,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
