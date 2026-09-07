import { INITIAL_SONGS, INITIAL_FOLDERS, INITIAL_CHURCHES, INITIAL_ADS } from './mockData';
import { saveSongOffline, getOfflineSongs } from './offlineStorage';

// Dynamically use the current host IP/domain so it works seamlessly on smartphones and PCs
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    return `http://${window.location.hostname}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Helper for HTTP requests with token
const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('cantaflow_token');
  const plan = localStorage.getItem('cantaflow_plan') || 'free';
  const headers = {
    'x-plan': plan,
  };
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Local storage fallback state
const getLocalData = (key, initial) => {
  try {
    const saved = localStorage.getItem(`cantaflow_${key}`);
    return saved ? JSON.parse(saved) : initial;
  } catch (e) {
    return initial;
  }
};

const setLocalData = (key, data) => {
  try {
    localStorage.setItem(`cantaflow_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn(`Could not save local ${key}`, e);
  }
};

export const api = {
  // === SONGS ===
  getSongs: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/songs?${query}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      setLocalData('songs', data);
      return data;
    } catch (err) {
      console.warn('[CantaFlow Offline/Fallback] Serving songs from local store and IndexedDB');
      let localSongs = getLocalData('songs', []);
      
      // Also merge any songs stored in IndexedDB (offline database)
      try {
        const offlineList = await getOfflineSongs();
        const mergedMap = new Map();
        localSongs.forEach((s) => mergedMap.set(s._id, s));
        offlineList.forEach((s) => {
          if (!mergedMap.has(s._id)) {
            mergedMap.set(s._id, s);
          } else {
            // Keep the one with isDownloaded: true
            const prev = mergedMap.get(s._id);
            mergedMap.set(s._id, { ...prev, isDownloaded: true });
          }
        });
        localSongs = Array.from(mergedMap.values());
      } catch (e) {
        console.warn('Could not read IndexedDB songs in fallback:', e);
      }

      if (localSongs.length === 0) {
        localSongs = INITIAL_SONGS;
      }

      if (params.category && params.category !== 'Todos') {
        localSongs = localSongs.filter((s) => s.category === params.category);
      }
      if (params.folderId) {
        if (params.folderId === 'none') {
          localSongs = localSongs.filter((s) => !s.folder);
        } else {
          localSongs = localSongs.filter((s) => s.folder?._id === params.folderId || s.folder === params.folderId);
        }
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        localSongs = localSongs.filter((s) =>
          s.title.toLowerCase().includes(q) ||
          s.artist.toLowerCase().includes(q) ||
          (s.lyrics && s.lyrics.toLowerCase().includes(q))
        );
      }
      return localSongs;
    }
  },

  uploadSong: async (formData) => {
    const file = formData.get('audio');
    try {
      const res = await fetch(`${API_BASE_URL}/songs`, {
        method: 'POST',
        headers: getHeaders(true),
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Falha no upload');
      }
      const newSong = await res.json();

      // Immediately cache the audio blob locally in IndexedDB for 0-latency offline playback
      if (file) {
        try {
          await saveSongOffline(newSong, file);
        } catch (e) {
          console.warn('Could not cache upload to IndexedDB:', e);
        }
      }

      const localSongs = getLocalData('songs', []);
      setLocalData('songs', [newSong, ...localSongs.filter((s) => s._id !== newSong._id)]);
      return newSong;
    } catch (err) {
      console.warn('[CantaFlow Local Storage Upload Fallback]:', err.message);
      // Create local song entry for offline testing
      const newSong = {
        _id: 'song_' + Date.now(),
        title: formData.get('title') || (file ? file.name.replace(/\.[^/.]+$/, '') : 'Nova Música'),
        artist: formData.get('artist') || 'Ministério de Louvor',
        category: formData.get('category') || 'Louvor Congregacional',
        folder: formData.get('folderId') || null,
        audioUrl: file ? URL.createObjectURL(file) : '',
        keySignature: formData.get('keySignature') || 'G',
        bpm: Number(formData.get('bpm')) || 72,
        lyrics: formData.get('lyrics') || '',
        chords: formData.get('chords') || '',
        tags: ['Recente'],
        duration: 200,
        fileSizeBytes: file ? file.size : 3000000,
        createdAt: new Date().toISOString(),
      };

      if (file) {
        try {
          await saveSongOffline(newSong, file);
        } catch (e) {
          console.warn('Could not cache fallback upload to IndexedDB:', e);
        }
      }

      const localSongs = getLocalData('songs', []);
      const updated = [newSong, ...localSongs];
      setLocalData('songs', updated);
      return newSong;
    }
  },

  updateSong: async (id, data) => {
    try {
      const res = await fetch(`${API_BASE_URL}/songs/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Falha ao atualizar música');
      return await res.json();
    } catch (err) {
      const localSongs = getLocalData('songs', INITIAL_SONGS);
      const updated = localSongs.map(s => s._id === id ? { ...s, ...data } : s);
      setLocalData('songs', updated);
      return updated.find(s => s._id === id);
    }
  },

  deleteSong: async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/songs/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Falha ao excluir música');
    } catch (err) {
      const localSongs = getLocalData('songs', INITIAL_SONGS);
      setLocalData('songs', localSongs.filter(s => s._id !== id));
    }
    return { success: true };
  },

  // === FOLDERS ===
  getFolders: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/folders`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      setLocalData('folders', data.folders);
      return data;
    } catch (err) {
      const folders = getLocalData('folders', INITIAL_FOLDERS);
      return { folders, unfiledCount: 0 };
    }
  },

  createFolder: async (data) => {
    try {
      const res = await fetch(`${API_BASE_URL}/folders`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Falha ao criar pasta');
      return await res.json();
    } catch (err) {
      const folders = getLocalData('folders', INITIAL_FOLDERS);
      const newFolder = {
        _id: 'folder_' + Date.now(),
        name: data.name,
        color: data.color || '#8b5cf6',
        icon: data.icon || 'Folder',
        description: data.description || '',
        songCount: 0,
      };
      setLocalData('folders', [...folders, newFolder]);
      return newFolder;
    }
  },

  deleteFolder: async (id) => {
    try {
      await fetch(`${API_BASE_URL}/folders/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
    } catch (err) {
      const folders = getLocalData('folders', INITIAL_FOLDERS);
      setLocalData('folders', folders.filter(f => f._id !== id));
    }
    return { success: true };
  },

  // === CHURCHES ===
  getChurches: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/churches?${query}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      setLocalData('churches', data.churches);
      return data;
    } catch (err) {
      let churches = getLocalData('churches', INITIAL_CHURCHES);
      if (params.neighborhood && params.neighborhood !== 'Todos') {
        churches = churches.filter(c => c.neighborhood === params.neighborhood);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        churches = churches.filter(c =>
          c.name.toLowerCase().includes(q) ||
          c.neighborhood.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q) ||
          (c.pastor && c.pastor.toLowerCase().includes(q))
        );
      }
      const neighborhoods = [...new Set(INITIAL_CHURCHES.map(c => c.neighborhood))];
      const cities = [...new Set(INITIAL_CHURCHES.map(c => c.city))];
      return { churches, total: churches.length, neighborhoods, cities };
    }
  },

  createChurch: async (churchData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/churches`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(churchData),
      });
      if (!res.ok) throw new Error('Falha ao cadastrar congregação');
      const newChurch = await res.json();
      const localChurches = getLocalData('churches', INITIAL_CHURCHES);
      setLocalData('churches', [newChurch, ...localChurches]);
      return newChurch;
    } catch (err) {
      console.warn('[CantaFlow Offline Fallback] Creating church locally:', err);
      const newChurch = {
        _id: 'church_' + Date.now(),
        ...churchData,
        createdAt: new Date().toISOString(),
      };
      const localChurches = getLocalData('churches', INITIAL_CHURCHES);
      setLocalData('churches', [newChurch, ...localChurches]);
      return newChurch;
    }
  },

  updateChurch: async (id, churchData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/churches/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(churchData),
      });
      if (!res.ok) throw new Error('Falha ao atualizar congregação');
      const updated = await res.json();
      const localChurches = getLocalData('churches', INITIAL_CHURCHES);
      setLocalData('churches', localChurches.map(c => (c._id === id ? updated : c)));
      return updated;
    } catch (err) {
      console.warn('[CantaFlow Offline Fallback] Updating church locally:', err);
      const localChurches = getLocalData('churches', INITIAL_CHURCHES);
      const updated = localChurches.map(c => (c._id === id ? { ...c, ...churchData } : c));
      setLocalData('churches', updated);
      return updated.find(c => c._id === id);
    }
  },

  deleteChurch: async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/churches/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Falha ao excluir congregação');
    } catch (err) {
      console.warn('[CantaFlow Offline Fallback] Deleting church locally:', err);
    }
    const localChurches = getLocalData('churches', INITIAL_CHURCHES);
    setLocalData('churches', localChurches.filter(c => c._id !== id));
    return { success: true };
  },

  uploadChurchPhoto: async (file) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const res = await fetch(`${API_BASE_URL}/churches/upload-photo`, {
        method: 'POST',
        headers: getHeaders(true),
        body: formData,
      });
      if (!res.ok) throw new Error('Falha no upload da foto');
      return await res.json();
    } catch (err) {
      console.warn('[CantaFlow Fallback Photo]:', err);
      return {
        photoUrl: URL.createObjectURL(file),
      };
    }
  },

  // === ADS ===
  getAds: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/ads`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch (err) {
      return INITIAL_ADS;
    }
  },

  // === PLAN / AUTH ===
  togglePlan: async (targetPlan) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/toggle-plan`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ targetPlan }),
      });
      if (!res.ok) throw new Error('Falha ao alterar plano');
      const data = await res.json();
      localStorage.setItem('cantaflow_plan', data.plan || targetPlan);
      return data;
    } catch (err) {
      localStorage.setItem('cantaflow_plan', targetPlan);
      return { success: true, plan: targetPlan };
    }
  }
};
