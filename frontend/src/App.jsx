import React, { useState, useEffect } from 'react';
import {
  Search,
  Music,
  FolderKanban,
  MapPin,
  Sparkles,
  Plus,
  Filter,
  ListMusic,
  Radio,
  SlidersHorizontal,
  Headphones,
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useAudioPlayer } from './context/AudioPlayerContext';
import { useOffline } from './context/OfflineContext';
import { HeaderBrand } from './components/layout/HeaderBrand';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { CategoryPills } from './components/music/CategoryPills';
import { SongCard } from './components/music/SongCard';
import { SongUploadModal } from './components/music/SongUploadModal';
import { RenameSongModal } from './components/music/RenameSongModal';
import { FolderGrid } from './components/folders/FolderGrid';
import { ChurchDirectory } from './components/churches/ChurchDirectory';
import { ChurchFormModal } from './components/churches/ChurchFormModal';
import { BottomPlayerBar } from './components/player/BottomPlayerBar';
import { FullScreenPlayerModal } from './components/player/FullScreenPlayerModal';
import { AdBanner } from './components/monetization/AdBanner';
import { UpgradeModal } from './components/monetization/UpgradeModal';
import { api } from './services/api';

export function App() {
  const { isPro, setIsUpgradeModalOpen } = useAuth();
  const { playSong } = useAudioPlayer();
  const { refreshOfflineList } = useOffline();

  // Navigation State: 'songs' | 'folders' | 'churches'
  const [activeTab, setActiveTab] = useState('songs');

  // Music & Church State
  const [songs, setSongs] = useState([]);
  const [folders, setFolders] = useState([]);
  const [churches, setChurches] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [isChurchModalOpen, setIsChurchModalOpen] = useState(false);
  const [editingChurch, setEditingChurch] = useState(null);

  // Load initial data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [songsData, foldersData, churchesData] = await Promise.all([
        api.getSongs(),
        api.getFolders(),
        api.getChurches(),
      ]);

      setSongs(songsData || []);
      setFolders(foldersData?.folders || []);
      setChurches(churchesData?.churches || []);
      setNeighborhoods(churchesData?.neighborhoods || []);
    } catch (err) {
      console.warn('Error fetching data, using offline fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered songs
  const filteredSongs = songs.filter((song) => {
    const matchesCategory =
      selectedCategory === 'Todos' || song.category === selectedCategory;

    const matchesFolder =
      selectedFolderId === null ||
      song.folder?._id === selectedFolderId ||
      song.folder === selectedFolderId;

    const matchesSearch =
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (song.artist && song.artist.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (song.lyrics && song.lyrics.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (song.tags && song.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCategory && matchesFolder && matchesSearch;
  });

  // Handlers - Songs
  const handleUploadSong = async (formData) => {
    try {
      const newSong = await api.uploadSong(formData);
      setSongs((prev) => [newSong, ...prev.filter((s) => s._id !== newSong._id)]);
      await refreshOfflineList();
      // Refresh folders for counts
      const fData = await api.getFolders();
      if (fData?.folders) setFolders(fData.folders);
    } catch (err) {
      console.error('Error in handleUploadSong:', err);
    }
  };

  const handleUpdateSong = async (id, data) => {
    const updated = await api.updateSong(id, data);
    setSongs((prev) => prev.map((s) => (s._id === id ? updated : s)));
    const fData = await api.getFolders();
    if (fData?.folders) setFolders(fData.folders);
  };

  const handleDeleteSong = async (id) => {
    if (confirm('Deseja realmente excluir esta música?')) {
      await api.deleteSong(id);
      setSongs((prev) => prev.filter((s) => s._id !== id));
      const fData = await api.getFolders();
      if (fData?.folders) setFolders(fData.folders);
    }
  };

  // Handlers - Folders
  const handleCreateFolder = async (folderData) => {
    const newFolder = await api.createFolder(folderData);
    setFolders((prev) => [...prev, newFolder]);
  };

  const handleDeleteFolder = async (id) => {
    await api.deleteFolder(id);
    setFolders((prev) => prev.filter((f) => f._id !== id));
    if (selectedFolderId === id) setSelectedFolderId(null);
  };

  // Handlers - Churches CRUD
  const handleOpenCreateChurch = () => {
    setEditingChurch(null);
    setIsChurchModalOpen(true);
  };

  const handleOpenEditChurch = (church) => {
    setEditingChurch(church);
    setIsChurchModalOpen(true);
  };

  const handleSaveChurch = async (payload, editingId) => {
    if (editingId) {
      const updated = await api.updateChurch(editingId, payload);
      setChurches((prev) => prev.map((c) => (c._id === editingId ? updated : c)));
    } else {
      const created = await api.createChurch(payload);
      setChurches((prev) => [created, ...prev]);
    }
    // Update unique neighborhoods list
    const cData = await api.getChurches();
    if (cData?.neighborhoods) setNeighborhoods(cData.neighborhoods);
  };

  const handleDeleteChurch = async (id) => {
    if (confirm('Deseja realmente excluir esta congregação do radar?')) {
      await api.deleteChurch(id);
      setChurches((prev) => prev.filter((c) => c._id !== id));
      const cData = await api.getChurches();
      if (cData?.neighborhoods) setNeighborhoods(cData.neighborhoods);
    }
  };

  const activeFolder = folders.find((f) => f._id === selectedFolderId);

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col pb-40 sm:pb-36 md:pb-24">
      
      {/* Top Header */}
      <HeaderBrand onOpenUpload={() => setIsUploadModalOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-3.5 sm:py-5">
        
        {/* Top Desktop Navigation Tabs */}
        <div className="hidden md:flex items-center justify-between pb-5 border-b border-white/5 mb-6">
          <div className="flex items-center gap-2 p-1.5 bg-dark-800/80 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('songs')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'songs'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>Músicas & Repertório</span>
            </button>

            <button
              onClick={() => setActiveTab('folders')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'folders'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Pastas & Cultos</span>
            </button>

            <button
              onClick={() => setActiveTab('churches')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'churches'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Radar de Igrejas & Maps</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'churches' ? (
              <button
                onClick={handleOpenCreateChurch}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-brand text-white text-xs font-bold shadow-lg shadow-purple-600/30 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Congregação</span>
              </button>
            ) : (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-brand text-white text-xs font-bold shadow-lg shadow-purple-600/30 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Upload de Louvor</span>
              </button>
            )}
          </div>
        </div>

        {/* ================= TAB 1: SONGS ================= */}
        {activeTab === 'songs' && (
          <div className="space-y-4 sm:space-y-6">
            
            {/* Folder Header Filter (if a folder is active) */}
            {activeFolder && (
              <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-purple-500/30 flex items-center justify-between gap-3 bg-gradient-to-r from-purple-950/40 via-dark-800 to-dark-800">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
                    style={{ backgroundColor: activeFolder.color || '#8b5cf6' }}
                  >
                    <FolderKanban className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                      Pasta Selecionada
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {activeFolder.name}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedFolderId(null)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white font-semibold transition-all active:scale-95"
                >
                  Ver Todas as Músicas
                </button>
              </div>
            )}

            {/* Category Filter Pills (Horizontal Scroll on Mobile) */}
            <CategoryPills
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar louvor por título, cantor, tom, cifra ou letra..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-dark-800/80 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner"
              />
            </div>

            {/* In-Feed Sponsored Ad for Free Users */}
            <AdBanner position="in_feed" />

            {/* Song Cards List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span className="font-semibold text-slate-300">
                  {filteredSongs.length} {filteredSongs.length === 1 ? 'música disponível' : 'músicas disponíveis'}
                </span>
                <span>Toque para ouvir ou ver cifras</span>
              </div>

              {filteredSongs.map((song) => (
                <SongCard
                  key={song._id}
                  song={song}
                  playlist={filteredSongs}
                  onEdit={(s) => setEditingSong(s)}
                  onDelete={handleDeleteSong}
                />
              ))}

              {filteredSongs.length === 0 && (
                <div className="text-center py-16 glass-card rounded-3xl p-8 border border-white/5">
                  <Headphones className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-white">
                    Nenhuma música encontrada
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Faça o upload do seu primeiro áudio ou tente alterar os filtros de busca.
                  </p>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-brand text-white text-xs font-bold shadow-lg shadow-purple-600/30 hover:opacity-95"
                  >
                    <Plus className="w-4 h-4" />
                    Fazer Upload Agora
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: FOLDERS ================= */}
        {activeTab === 'folders' && (
          <div className="space-y-6">
            <FolderGrid
              folders={folders}
              selectedFolderId={selectedFolderId}
              onSelectFolder={(id) => {
                setSelectedFolderId(id);
                setActiveTab('songs');
              }}
              onCreateFolder={handleCreateFolder}
              onDeleteFolder={handleDeleteFolder}
              songs={songs}
            />

            <AdBanner position="bottom_banner" />
          </div>
        )}

        {/* ================= TAB 3: CHURCHES & MAPS ================= */}
        {activeTab === 'churches' && (
          <ChurchDirectory
            churches={churches}
            neighborhoods={neighborhoods}
            onOpenCreate={handleOpenCreateChurch}
            onEditChurch={handleOpenEditChurch}
            onDeleteChurch={handleDeleteChurch}
          />
        )}
      </main>

      {/* Persistent Mini Audio Player */}
      <BottomPlayerBar />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Modals */}
      <SongUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadSong}
        folders={folders}
      />

      <RenameSongModal
        isOpen={!!editingSong}
        song={editingSong}
        onClose={() => setEditingSong(null)}
        onSave={handleUpdateSong}
        onDelete={handleDeleteSong}
        folders={folders}
      />

      <ChurchFormModal
        isOpen={isChurchModalOpen}
        onClose={() => setIsChurchModalOpen(false)}
        onSave={handleSaveChurch}
        editingChurch={editingChurch}
      />

      <FullScreenPlayerModal />

      <UpgradeModal />
    </div>
  );
}
export default App;
