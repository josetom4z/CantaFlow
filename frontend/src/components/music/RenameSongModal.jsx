import React, { useState, useEffect } from 'react';
import { X, Edit3, Check, Loader2, Trash2 } from 'lucide-react';
import { INITIAL_CATEGORIES } from '../../services/mockData';

export const RenameSongModal = ({
  isOpen,
  onClose,
  song,
  onSave,
  onDelete,
  folders = [],
}) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [category, setCategory] = useState('Louvor Congregacional');
  const [folderId, setFolderId] = useState('');
  const [keySignature, setKeySignature] = useState('G');
  const [bpm, setBpm] = useState(72);
  const [lyrics, setLyrics] = useState('');
  const [chords, setChords] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (song) {
      setTitle(song.title || '');
      setArtist(song.artist || '');
      setCategory(song.category || 'Louvor Congregacional');
      setFolderId(song.folder?._id || song.folder || '');
      setKeySignature(song.keySignature || 'G');
      setBpm(song.bpm || 72);
      setLyrics(song.lyrics || '');
      setChords(song.chords || '');
    }
  }, [song]);

  if (!isOpen || !song) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSave(song._id, {
        title,
        artist,
        category,
        folderId: folderId || null,
        keySignature,
        bpm: Number(bpm),
        lyrics,
        chords,
      });
      onClose();
    } catch (err) {
      console.error('Error updating song:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const musicalKeys = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B', 'Am', 'Bm', 'Cm', 'Dm', 'Em', 'Fm', 'Gm', 'F#m'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-white/10 shadow-2xl max-h-[92dvh] overflow-y-auto my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Editar / Renomear</h2>
              <p className="text-[11px] sm:text-xs text-slate-400">Atualize título, categoria e dados musicais</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 sm:space-y-4">
          
          {/* Title & Artist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 mb-1">
                Nome da Música *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 mb-1">
                Ministério / Cantor
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Category & Folder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
              >
                {INITIAL_CATEGORIES.filter((c) => c !== 'Todos').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 mb-1">
                Mover para Pasta
              </label>
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
              >
                <option value="">Sem Pasta (Raiz)</option>
                {folders.map((f) => (
                  <option key={f._id} value={f._id}>
                    📂 {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Key & BPM */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 mb-1">
                Tom Original
              </label>
              <select
                value={keySignature}
                onChange={(e) => setKeySignature(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500 font-mono"
              >
                {musicalKeys.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 mb-1">
                BPM
              </label>
              <input
                type="number"
                min="40"
                max="220"
                value={bpm}
                onChange={(e) => setBpm(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-900/90 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Lyrics / Chords */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 mb-1">
              Letra & Cifras
            </label>
            <textarea
              rows="3"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-dark-900/90 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            {onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(song._id);
                  onClose();
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title}
                className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl text-xs font-bold text-white gradient-brand shadow-lg shadow-purple-600/30 hover:opacity-95 active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Salvar
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
