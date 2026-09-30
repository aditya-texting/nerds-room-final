import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (token: string, hideToast?: boolean) => Promise<void>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      const { data } = await api.get('/auth/me');
      setUser(data.user || data);
    } catch (error) {
      console.error('Failed to fetch user', error);
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(c => c.trim().startsWith('google_auth_token='));
    
    if (authCookie) {
      const urlToken = authCookie.split('=')[1];
      if (urlToken) {
        localStorage.setItem('token', urlToken);
        document.cookie = 'google_auth_token=; Max-Age=0; path=/';
      }
    }
    
    const params = new URLSearchParams(window.location.search);
    if (params.has('error')) {
      toast.error('Google Login failed');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    refreshUser();
  }, []);

  const signIn = async (token: string, hideToast: boolean = false) => {
    localStorage.setItem('token', token);
    await refreshUser();
    if (!hideToast) {
      toast.success('Signed in successfully!');
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Signed out');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
