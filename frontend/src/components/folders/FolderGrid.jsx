import React, { useState } from 'react';
import {
  Folder as FolderIcon,
  Plus,
  Share2,
  Trash2,
  Music,
  FolderOpen,
  Sparkles,
  Users,
  BookOpen,
  Headphones,
} from 'lucide-react';
import { shareFolderOnWhatsApp } from '../../services/whatsappHelper';

export const FolderGrid = ({
  folders = [],
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
  onDeleteFolder,
  songs = [],
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#8b5cf6');
  const [newFolderDesc, setNewFolderDesc] = useState('');

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    await onCreateFolder({
      name: newFolderName.trim(),
      color: newFolderColor,
      description: newFolderDesc.trim(),
    });

    setNewFolderName('');
    setNewFolderDesc('');
    setIsCreateModalOpen(false);
  };

  const getFolderSongs = (fId) => {
    return songs.filter((s) => s.folder?._id === fId || s.folder === fId);
  };

  const colorPalette = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#06b6d4', '#ef4444'];

  return (
    <div className="space-y-4">
      
      {/* Header with Title & Add Folder Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-purple-400" />
            Pastas & Repertórios
          </h2>
          <p className="text-xs text-slate-400">
            Organize músicas por culto, rede ou ministério
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-purple-600/20 text-purple-300 border border-purple-500/30 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Pasta</span>
        </button>
      </div>

      {/* Folders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        
        {/* All Songs / Root Folder Card */}
        <div
          onClick={() => onSelectFolder(null)}
          className={`cursor-pointer rounded-2xl p-4 transition-all border ${
            selectedFolderId === null
              ? 'border-purple-500 bg-purple-950/30 shadow-lg shadow-purple-900/20'
              : 'glass-card border-white/5 hover:border-purple-500/30'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Todas as Músicas</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {songs.length} {songs.length === 1 ? 'louvor' : 'louvores'} no acervo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Folders */}
        {folders.map((folder) => {
          const isSelected = selectedFolderId === folder._id;
          const folderSongs = getFolderSongs(folder._id);

          return (
            <div
              key={folder._id}
              className={`relative group glass-card rounded-2xl p-4 transition-all border ${
                isSelected
                  ? 'border-purple-500 bg-purple-950/30 shadow-lg shadow-purple-900/20'
                  : 'border-white/5 hover:border-purple-500/30'
              }`}
            >
              <div
                onClick={() => onSelectFolder(folder._id)}
                className="cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-3 rounded-xl border shadow-sm"
                      style={{
                        backgroundColor: `${folder.color || '#8b5cf6'}20`,
                        borderColor: `${folder.color || '#8b5cf6'}40`,
                        color: folder.color || '#8b5cf6',
                      }}
                    >
                      <FolderIcon className="w-6 h-6 fill-current opacity-80" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white truncate group-hover:text-purple-300">
                        {folder.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {folderSongs.length} {folderSongs.length === 1 ? 'música' : 'músicas'}
                      </p>
                    </div>
                  </div>
                </div>

                {folder.description && (
                  <p className="text-xs text-slate-400 mt-2.5 line-clamp-1 italic">
                    {folder.description}
                  </p>
                )}
              </div>

              {/* Action Buttons for Folder (WhatsApp share playlist & delete) */}
              <div className="flex items-center justify-end gap-1.5 mt-3 pt-2.5 border-t border-white/5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    shareFolderOnWhatsApp(folder, folderSongs);
                  }}
                  title="Compartilhar repertório desta pasta no WhatsApp"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-semibold transition-all active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Escala WhatsApp</span>
                </button>

                {onDeleteFolder && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Deseja remover a pasta "${folder.name}"? As músicas serão movidas para a raiz.`)) {
                        onDeleteFolder(folder._id);
                      }
                    }}
                    title="Excluir pasta"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Criar Pasta */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Criar Nova Pasta</h3>
            <p className="text-xs text-slate-400 mb-4">
              Agrupe os louvores para um culto ou ensaio específico
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nome da Pasta / Repertório *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Ex: Culto da Juventude - Sábado"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-dark-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Descrição (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Escala de louvor com ministração e apelo"
                  value={newFolderDesc}
                  onChange={(e) => setNewFolderDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-dark-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Cor de Destaque
                </label>
                <div className="flex items-center gap-2">
                  {colorPalette.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewFolderColor(color)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        newFolderColor === color
                          ? 'ring-2 ring-white scale-110 shadow-md'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newFolderName.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white gradient-brand shadow-lg shadow-purple-600/30 hover:opacity-95 disabled:opacity-50"
                >
                  Criar Pasta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
