import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppDataProvider } from './context/AppDataContext';
import './index.css';
import MainContent from './MainContent';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <AppDataProvider>
        <MainContent />
        <Toaster position="top-center" />
      </AppDataProvider>
    </AuthProvider>
  </React.StrictMode>,
);
