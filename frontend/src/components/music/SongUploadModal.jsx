import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Music,
  FileAudio,
  Check,
  Loader2,
} from 'lucide-react';
import { INITIAL_CATEGORIES } from '../../services/mockData';

export const SongUploadModal = ({ isOpen, onClose, onUpload, folders = [] }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [category, setCategory] = useState('Louvor Congregacional');
  const [folderId, setFolderId] = useState('');
  const [keySignature, setKeySignature] = useState('G');
  const [bpm, setBpm] = useState(72);
  const [lyrics, setLyrics] = useState('');
  const [chords, setChords] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) {
        const cleanName = selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !title) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      if (file) formData.append('audio', file);
      formData.append('title', title);
      formData.append('artist', artist || 'Ministério de Louvor');
      formData.append('category', category);
      formData.append('folderId', folderId || '');
      formData.append('keySignature', keySignature);
      formData.append('bpm', bpm);
      formData.append('lyrics', lyrics);
      formData.append('chords', chords);

      await onUpload(formData);
      onClose();
      setFile(null);
      setTitle('');
      setArtist('');
      setLyrics('');
      setChords('');
    } catch (err) {
      console.error('Error uploading song:', err);
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
              <Music className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Upload de Música</h2>
              <p className="text-[11px] sm:text-xs text-slate-400">Adicione um áudio ou playback</p>
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
          
          {/* Audio Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
              dragActive
                ? 'border-purple-500 bg-purple-500/10'
                : file
                ? 'border-emerald-500/50 bg-emerald-500/5'
                : 'border-white/15 bg-dark-800/60 hover:border-purple-500/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,.mp3,.wav,.m4a,.ogg,.aac"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />

            {file ? (
              <div className="flex items-center gap-2.5 text-emerald-400">
                <FileAudio className="w-7 h-7 flex-shrink-0" />
                <div className="min-w-0 text-left">
                  <p className="text-xs sm:text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                  <p className="text-[10px] sm:text-xs text-slate-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Toque para trocar
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mb-1.5" />
                <p className="text-xs sm:text-sm font-semibold text-slate-200 text-center">
                  Toque para escolher áudio (MP3, WAV, M4A)
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Até 50MB
                </p>
              </>
            )}
          </div>

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
                placeholder="Ex: Bondade de Deus"
                className="w-full px-3 py-2 rounded-xl bg-dark-900/90 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500"
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
                placeholder="Ex: Isaías Saad"
                className="w-full px-3 py-2 rounded-xl bg-dark-900/90 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Category & Folder Selector */}
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
                Pasta / Repertório
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

          {/* Key Signature (Tom) & BPM */}
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
                BPM (Andamento)
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
              Letra & Cifras (Opcional)
            </label>
            <textarea
              rows="3"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Cole a letra ou cifras para a equipe acompanhar durante o ensaio..."
              className="w-full px-3 py-2 rounded-xl bg-dark-900/90 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (!file && !title)}
              className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl text-xs font-bold text-white gradient-brand shadow-lg shadow-purple-600/30 hover:opacity-95 disabled:opacity-50 active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Salvar Música
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
