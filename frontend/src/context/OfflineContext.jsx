import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  saveSongOffline,
  removeSongOffline,
  getOfflineSongs,
  getNetworkAudioUrl,
  preloadOfflineBlobUrls,
  db,
} from '../services/offlineStorage';

const OfflineContext = createContext();

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineSongIds, setOfflineSongIds] = useState(new Set());
  const [downloadingIds, setDownloadingIds] = useState(new Set());

  // Listen to network changes
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial load of offline songs & preloading object URLs
    refreshOfflineList();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const refreshOfflineList = async () => {
    try {
      // Pre-cache object URLs in memory for 0ms instant mobile playback
      await preloadOfflineBlobUrls();

      const allOffline = await db.songs.toArray();
      const validIds = [];

      for (const record of allOffline) {
        if (record._id && record.audioBlob && record.audioBlob.size > 1000) {
          validIds.push(record._id);
        }
      }

      setOfflineSongIds(new Set(validIds));
    } catch (e) {
      console.warn('Error refreshing offline songs list:', e);
    }
  };

  const toggleDownloadSong = async (song) => {
    if (!song || !song._id) return;

    if (offlineSongIds.has(song._id)) {
      // Remove offline
      await removeSongOffline(song._id);
      setOfflineSongIds((prev) => {
        const next = new Set(prev);
        next.delete(song._id);
        return next;
      });
    } else {
      // Download
      try {
        setDownloadingIds((prev) => new Set(prev).add(song._id));

        // Get the real, full audio URL
        const audioNetworkUrl = getNetworkAudioUrl(song);
        if (!audioNetworkUrl) {
          throw new Error('URL do áudio não encontrada.');
        }

        // Fetch audio as real binary blob
        const res = await fetch(audioNetworkUrl);
        if (!res.ok) {
          throw new Error(`Servidor retornou status ${res.status}`);
        }

        const blob = await res.blob();
        if (!blob || blob.size < 1000) {
          throw new Error('Arquivo de áudio baixado está vazio ou corrompido.');
        }

        await saveSongOffline(song, blob);
        setOfflineSongIds((prev) => new Set(prev).add(song._id));
      } catch (err) {
        console.error('Falha ao baixar áudio para modo offline:', err);
        alert(`Não foi possível baixar o áudio para offline: ${err.message}`);
      } finally {
        setDownloadingIds((prev) => {
          const next = new Set(prev);
          next.delete(song._id);
          return next;
        });
      }
    }
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        offlineSongIds,
        downloadingIds,
        toggleDownloadSong,
        refreshOfflineList,
        isSongDownloaded: (id) => offlineSongIds.has(id),
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => useContext(OfflineContext);

