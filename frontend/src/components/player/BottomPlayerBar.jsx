import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Maximize2,
  CheckCircle2,
  FileText,
  Share2,
} from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { useOffline } from '../../context/OfflineContext';
import { shareSongOnWhatsApp } from '../../services/whatsappHelper';
import { AudioScrubber } from './AudioScrubber';

export const BottomPlayerBar = () => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    handleNextTrack,
    handlePrevTrack,
    currentTime,
    duration,
    seek,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    setIsFullScreenOpen,
    formatTime,
  } = useAudioPlayer();

  const { isSongDownloaded } = useOffline();

  if (!currentSong) return null;

  const isDownloaded = isSongDownloaded(currentSong._id);

  return (
    <div className="fixed bottom-[calc(3.75rem+env(safe-area-inset-bottom,0px))] md:bottom-0 left-0 right-0 z-30 glass-dock border-t border-purple-500/30 shadow-2xl transition-all">
      
      {/* Touch-optimized Progress Bar (Scrubber) */}
      <div className="absolute top-0 left-0 right-0 -translate-y-1/2 px-0 z-20">
        <AudioScrubber
          currentTime={currentTime}
          duration={duration}
          onSeek={seek}
          height="h-1.5"
          showThumb={true}
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2">
        
        {/* Left: Track Info & Disc */}
        <div
          onClick={() => setIsFullScreenOpen(true)}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0 flex-1 max-w-[55%] sm:max-w-xs"
        >
          <div className="relative flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-brand flex items-center justify-center text-white shadow-md shadow-purple-500/30">
            {isPlaying ? (
              <div className="flex items-center justify-center gap-0.5">
                <span className="w-0.5 h-3 bg-white rounded-full animate-eq-1" />
                <span className="w-0.5 h-4 bg-white rounded-full animate-eq-2" />
                <span className="w-0.5 h-2.5 bg-white rounded-full animate-eq-3" />
              </div>
            ) : (
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5 fill-current" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h4 className="text-xs sm:text-sm font-bold text-white truncate hover:text-purple-300">
                {currentSong.title}
              </h4>
              {isDownloaded && (
                <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              )}
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
              {currentSong.artist || 'Louvor'} {currentSong.keySignature ? `• Tom ${currentSong.keySignature}` : ''}
            </p>
          </div>
        </div>

        {/* Center / Right: Playback Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          
          <button
            onClick={handlePrevTrack}
            title="Música anterior"
            className="p-1.5 text-slate-400 hover:text-white transition-colors hidden xs:block"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full gradient-brand text-white flex items-center justify-center shadow-md shadow-purple-600/40 active:scale-95 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 ml-0.5 fill-current" />
            )}
          </button>

          <button
            onClick={handleNextTrack}
            title="Próxima música"
            className="p-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Open Fullscreen Lyrics / Chords */}
          <button
            onClick={() => setIsFullScreenOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold hover:bg-purple-600/30 transition-all"
            title="Abrir Cifras e Letra"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cifras</span>
          </button>

          {/* WhatsApp Share (Desktop) */}
          <button
            onClick={() => shareSongOnWhatsApp(currentSong)}
            title="Compartilhar no WhatsApp"
            className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all hidden md:block"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Volume Slider (Desktop) */}
          <div className="hidden lg:flex items-center gap-1.5 pl-2 border-l border-white/10">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 text-slate-400 hover:text-white"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-14 accent-purple-500 cursor-pointer h-1"
            />
          </div>

          <button
            onClick={() => setIsFullScreenOpen(true)}
            className="p-1.5 text-slate-400 hover:text-white transition-colors hidden sm:block"
            title="Expandir player"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
