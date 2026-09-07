import React from 'react';
import {
  Play,
  Pause,
  Share2,
  Download,
  CheckCircle2,
  Loader2,
  Edit2,
  Trash2,
  Folder as FolderIcon,
} from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { useOffline } from '../../context/OfflineContext';
import { shareSongOnWhatsApp } from '../../services/whatsappHelper';

export const SongCard = ({ song, onEdit, onDelete, playlist = [] }) => {
  const { currentSong, isPlaying, playSong, togglePlay } = useAudioPlayer();
  const { isSongDownloaded, toggleDownloadSong, downloadingIds } = useOffline();

  const isCurrent = currentSong?._id === song._id;
  const isDownloaded = isSongDownloaded(song._id);
  const isDownloading = downloadingIds.has(song._id);

  const handlePlayClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song, playlist);
    }
  };

  return (
    <div
      className={`group relative glass-card rounded-2xl p-3 sm:p-4 transition-all duration-200 border ${
        isCurrent
          ? 'border-purple-500/60 bg-purple-950/25 shadow-lg shadow-purple-900/20'
          : 'border-white/5 hover:border-purple-500/30 hover:bg-dark-700/60'
      }`}
    >
      <div className="flex items-start sm:items-center gap-2.5 sm:gap-3.5">
        
        {/* Play / Pause Animated Disc Button */}
        <button
          onClick={handlePlayClick}
          aria-label={isCurrent && isPlaying ? 'Pausar' : 'Reproduzir'}
          className={`relative flex-shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl transition-all shadow-md mt-0.5 sm:mt-0 ${
            isCurrent && isPlaying
              ? 'gradient-brand text-white shadow-purple-500/40 ring-2 ring-purple-400'
              : 'bg-dark-600 text-slate-200 group-hover:bg-purple-600 group-hover:text-white'
          }`}
        >
          {isCurrent && isPlaying ? (
            <div className="flex items-center justify-center gap-0.5">
              <span className="w-1 h-3 sm:h-4 bg-white rounded-full animate-eq-1" />
              <span className="w-1 h-4 sm:h-5 bg-white rounded-full animate-eq-2" />
              <span className="w-1 h-2.5 sm:h-3 bg-white rounded-full animate-eq-3" />
              <span className="w-1 h-3.5 sm:h-4 bg-white rounded-full animate-eq-4" />
            </div>
          ) : (
            <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5 fill-current" />
          )}
        </button>

        {/* Title, Artist & Metadata */}
        <div className="flex-1 min-w-0" onClick={handlePlayClick} role="button">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-xs sm:text-base font-bold text-white truncate group-hover:text-purple-300 transition-colors">
              {song.title}
            </h3>
            {isDownloaded && (
              <span
                title="Salvo no celular para tocar offline"
                className="flex items-center text-emerald-400 text-xs flex-shrink-0"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <p className="text-[11px] sm:text-xs text-slate-400 truncate mt-0.5">
            {song.artist || 'Ministério de Louvor'}
          </p>

          {/* Key, BPM & Category Badges */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-2">
            {song.keySignature && (
              <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Tom: {song.keySignature}
              </span>
            )}
            {song.bpm > 0 && (
              <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                {song.bpm} BPM
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700 truncate max-w-[120px] sm:max-w-[150px]">
              {song.category || 'Geral'}
            </span>
            {song.folder && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 truncate max-w-[150px]">
                <FolderIcon className="w-2.5 h-2.5" />
                {song.folder.name || 'Pasta'}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons (WhatsApp, Offline Download, Edit) */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0 self-center">
          
          {/* WhatsApp Share Button */}
          <button
            onClick={() => shareSongOnWhatsApp(song)}
            title="Compartilhar no WhatsApp"
            className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Download for Offline Storage Button */}
          <button
            onClick={() => toggleDownloadSong(song)}
            disabled={isDownloading}
            title={
              isDownloaded
                ? 'Música salva offline. Clique para remover'
                : 'Baixar para ouvir offline sem internet'
            }
            className={`p-1.5 sm:p-2 rounded-lg border transition-all ${
              isDownloaded
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
            }`}
          >
            {isDownloading ? (
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-purple-400" />
            ) : isDownloaded ? (
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>

          {/* Edit / Rename Button */}
          <button
            onClick={() => onEdit(song)}
            title="Editar ou Renomear"
            className="p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-purple-600/20 text-slate-400 hover:text-purple-300 border border-white/10 transition-all"
          >
            <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Delete Button (Desktop) */}
          {onDelete && (
            <button
              onClick={() => onDelete(song._id)}
              title="Excluir música"
              className="p-2 rounded-lg bg-white/5 hover:bg-rose-600/20 text-slate-400 hover:text-rose-400 border border-white/10 transition-all hidden md:block"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
