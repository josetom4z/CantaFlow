import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { OfflineProvider } from './context/OfflineContext';
import { AudioPlayerProvider } from './context/AudioPlayerContext';

// Register PWA Service Worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[CantaFlow PWA] Service Worker registrado com sucesso:', reg.scope);
      })
      .catch((err) => {
        console.warn('[CantaFlow PWA] Falha ao registrar Service Worker:', err);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <OfflineProvider>
        <AudioPlayerProvider>
          <App />
        </AudioPlayerProvider>
      </OfflineProvider>
    </AuthProvider>
  </React.StrictMode>
);
