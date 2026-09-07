import Dexie from 'dexie';

export const db = new Dexie('CantaFlowOfflineDB');

db.version(1).stores({
  songs: '++id, _id, title, artist, category, folder, keySignature, bpm, lyrics, chords, isDownloaded, audioBlob, createdAt',
  folders: '++id, _id, name, color, icon',
  churches: '++id, _id, name, neighborhood, city, isSede',
  settings: 'key, value',
});

// Cache in-memory object URLs to enable instantaneous, synchronous playback on mobile browsers (preserves user gesture)
const memoryObjectUrls = new Map();

export const getCachedBlobUrl = (songId) => {
  if (!songId) return null;
  return memoryObjectUrls.get(songId) || null;
};

export const setCachedBlobUrl = (songId, blob) => {
  if (!songId || !blob) return null;
  
  // Revoke old URL if exists to avoid memory leak
  if (memoryObjectUrls.has(songId)) {
    try {
      URL.revokeObjectURL(memoryObjectUrls.get(songId));
    } catch (e) {}
  }

  // Ensure correct audio MIME type for iOS Safari and Android Chrome
  let typedBlob = blob;
  if (!blob.type || blob.type === 'application/octet-stream' || blob.type === '') {
    typedBlob = new Blob([blob], { type: 'audio/mpeg' });
  }

  try {
    const url = URL.createObjectURL(typedBlob);
    memoryObjectUrls.set(songId, url);
    return url;
  } catch (err) {
    console.warn('Could not create ObjectURL:', err);
    return null;
  }
};

// Pre-load all offline songs into memory on app startup
export const preloadOfflineBlobUrls = async () => {
  try {
    const all = await db.songs.toArray();
    for (const record of all) {
      if (record._id && record.audioBlob && record.audioBlob.size > 1000) {
        setCachedBlobUrl(record._id, record.audioBlob);
      }
    }
  } catch (err) {
    console.warn('Error preloading offline blobs:', err);
  }
};

// Helper to save downloaded audio blob for offline playback
export const saveSongOffline = async (song, audioBlob) => {
  try {
    if (!song || !song._id) return false;

    // Ensure blob is typed properly
    let finalBlob = audioBlob;
    if (audioBlob && (!audioBlob.type || audioBlob.type === 'application/octet-stream' || audioBlob.type === '')) {
      finalBlob = new Blob([audioBlob], { type: 'audio/mpeg' });
    }

    const existing = await db.songs.where('_id').equals(song._id).first();
    const songData = {
      _id: song._id,
      title: song.title,
      artist: song.artist,
      category: song.category,
      folder: song.folder?._id || song.folder || null,
      keySignature: song.keySignature,
      bpm: song.bpm,
      lyrics: song.lyrics,
      chords: song.chords,
      duration: song.duration,
      originalFileName: song.originalFileName,
      audioBlob: finalBlob || null,
      isDownloaded: !!(finalBlob && finalBlob.size > 1000),
      downloadedAt: new Date().toISOString(),
      createdAt: song.createdAt || new Date().toISOString(),
    };

    if (existing) {
      await db.songs.update(existing.id, songData);
    } else {
      await db.songs.add(songData);
    }

    if (finalBlob && finalBlob.size > 1000) {
      setCachedBlobUrl(song._id, finalBlob);
    }

    return true;
  } catch (err) {
    console.error('Error saving song offline:', err);
    return false;
  }
};

// Helper to remove offline song
export const removeSongOffline = async (songId) => {
  try {
    if (memoryObjectUrls.has(songId)) {
      try {
        URL.revokeObjectURL(memoryObjectUrls.get(songId));
      } catch (e) {}
      memoryObjectUrls.delete(songId);
    }
    const record = await db.songs.where('_id').equals(songId).first();
    if (record) {
      await db.songs.delete(record.id);
    }
    return true;
  } catch (err) {
    console.error('Error removing offline song:', err);
    return false;
  }
};

// Get all offline songs
export const getOfflineSongs = async () => {
  try {
    return await db.songs.toArray();
  } catch (err) {
    console.error('Error loading offline songs:', err);
    return [];
  }
};

// Check if song is downloaded
export const isSongOffline = async (songId) => {
  if (memoryObjectUrls.has(songId)) return true;
  try {
    const song = await db.songs.where('_id').equals(songId).first();
    return !!(song && song.audioBlob && song.audioBlob.size > 1000);
  } catch (err) {
    return false;
  }
};

// Helper to format full network audio URL
export const getNetworkAudioUrl = (song) => {
  if (!song) return '';
  const rawUrl = song.audioUrl || '';
  if (!rawUrl) return '';

  // 1. If it's already an absolute HTTP, HTTPS or Blob URL
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://') || rawUrl.startsWith('blob:')) {
    return rawUrl;
  }

  // 2. If it's a relative upload path like /uploads/audio/...
  const cleanPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
  const hostname = typeof window !== 'undefined' && window.location && window.location.hostname
    ? window.location.hostname
    : 'localhost';

  return `http://${hostname}:5000${cleanPath}`;
};

// Synchronous audio URL retriever for zero-latency mobile play gesture
export const getPlayableAudioUrlSync = (song) => {
  if (!song) return '';
  const cachedUrl = memoryObjectUrls.get(song._id);
  if (cachedUrl) return cachedUrl;
  return getNetworkAudioUrl(song);
};

// Helper to format full audio URL (from Blob or Network)
export const getPlayableAudioUrl = async (song) => {
  if (!song) return '';

  // 1. Check memory cache first
  if (memoryObjectUrls.has(song._id)) {
    return memoryObjectUrls.get(song._id);
  }

  // 2. Try to read offline blob from IndexedDB
  try {
    const local = await db.songs.where('_id').equals(song._id).first();
    if (local && local.audioBlob && local.audioBlob.size > 1000) {
      return setCachedBlobUrl(song._id, local.audioBlob);
    }
  } catch (e) {
    console.warn('Could not read from IndexedDB blob:', e);
  }

  // 3. Fallback to network URL
  return getNetworkAudioUrl(song);
};

