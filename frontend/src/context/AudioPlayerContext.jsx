import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { getPlayableAudioUrl, getPlayableAudioUrlSync } from '../services/offlineStorage';

const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isShuffle, setIsShuffle] = useState(false);
  const [loopMode, setLoopMode] = useState('off'); // 'off' | 'all' | 'one'
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [transposeSemitones, setTransposeSemitones] = useState(0);

  const audioRef = useRef(new Audio());

  // Setup audio event listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => handleNextTrack();
    const handleError = (e) => {
      console.warn('Audio playback notice:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, []);

  // Update volume & rate when state changes
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume;
    audio.playbackRate = playbackRate;
  }, [volume, isMuted, playbackRate]);

  const playSong = async (song, newQueue = null) => {
    if (!song) return;

    if (newQueue) {
      setQueue(newQueue);
    } else if (!queue.some((s) => s._id === song._id)) {
      setQueue((prev) => [...prev, song]);
    }

    setCurrentSong(song);
    setTransposeSemitones(0);

    const audio = audioRef.current;
    // 1. Instant synchronous URL lookup (preserves mobile touch gesture token)
    const syncUrl = getPlayableAudioUrlSync(song);

    if (syncUrl) {
      audio.src = syncUrl;
      audio.load();
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Synchronous play notice, attempting async fallback:', err);
          attemptAsyncPlay(song);
        });
    } else {
      attemptAsyncPlay(song);
    }
  };

  const attemptAsyncPlay = async (song) => {
    try {
      const audioUrl = await getPlayableAudioUrl(song);
      if (!audioUrl) return;

      const audio = audioRef.current;
      audio.src = audioUrl;
      audio.load();

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Async playback notice:', err);
            setIsPlaying(false);
          });
      }
    } catch (e) {
      console.error('Error initiating playback:', e);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!currentSong) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (!audio.src || audio.src === '' || audio.src === window.location.href) {
        const syncUrl = getPlayableAudioUrlSync(currentSong);
        if (syncUrl) {
          audio.src = syncUrl;
          audio.load();
        }
      }
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const seek = (seconds) => {
    const audio = audioRef.current;
    audio.currentTime = seconds;
    setCurrentTime(seconds);
  };

  const handleNextTrack = () => {
    if (loopMode === 'one' && currentSong) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }

    if (!queue || queue.length === 0) {
      setIsPlaying(false);
      return;
    }

    const currentIndex = queue.findIndex((s) => s._id === currentSong?._id);

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      playSong(queue[randomIndex]);
      return;
    }

    if (currentIndex >= 0 && currentIndex < queue.length - 1) {
      playSong(queue[currentIndex + 1]);
    } else if (loopMode === 'all' && queue.length > 0) {
      playSong(queue[0]);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrevTrack = () => {
    if (currentTime > 3) {
      seek(0);
      return;
    }

    const currentIndex = queue.findIndex((s) => s._id === currentSong?._id);
    if (currentIndex > 0) {
      playSong(queue[currentIndex - 1]);
    } else if (queue.length > 0) {
      playSong(queue[queue.length - 1]);
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentSong,
        queue,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        playbackRate,
        isShuffle,
        loopMode,
        isFullScreenOpen,
        transposeSemitones,
        playSong,
        togglePlay,
        seek,
        handleNextTrack,
        handlePrevTrack,
        setVolume,
        setIsMuted,
        setPlaybackRate,
        setIsShuffle: () => setIsShuffle((prev) => !prev),
        toggleLoopMode: () =>
          setLoopMode((prev) =>
            prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'
          ),
        setIsFullScreenOpen,
        setTransposeSemitones,
        formatTime,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);
