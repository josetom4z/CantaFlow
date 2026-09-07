import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Map as MapIcon,
  ListFilter,
  Compass,
  Church as ChurchIcon,
  Plus,
} from 'lucide-react';
import { ChurchCard } from './ChurchCard';
import { ChurchMap } from './ChurchMap';

const InstagramIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export const ChurchDirectory = ({
  churches = [],
  neighborhoods = [],
  onOpenCreate,
  onEditChurch,
  onDeleteChurch,
}) => {
  const [search, setSearch] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Todos');
  const [selectedDay, setSelectedDay] = useState('Todos');
  const [viewMode, setViewMode] = useState('both'); // 'both' | 'map' | 'list'
  const [focusedChurch, setFocusedChurch] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const daysOfWeek = ['Todos', 'Domingo', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

  // Handle GPS location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo seu dispositivo.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
      }
    );
  };

  // Filtered churches
  const filteredChurches = churches.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase()) ||
      (c.pastor && c.pastor.toLowerCase().includes(search.toLowerCase()));

    const matchesNeighborhood =
      selectedNeighborhood === 'Todos' || c.neighborhood === selectedNeighborhood;

    const matchesDay =
      selectedDay === 'Todos' ||
      (c.cultosSchedule &&
        c.cultosSchedule.some((s) =>
          s.day.toLowerCase().includes(selectedDay.toLowerCase())
        ));

    return matchesSearch && matchesNeighborhood && matchesDay;
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
            <ChurchIcon className="w-5 h-5 text-purple-400" />
            Radar de Igrejas & Maps
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400">
            AD Guaratinguetá e congregações da região
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          {/* New Church Button */}
          {onOpenCreate && (
            <button
              onClick={onOpenCreate}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl gradient-brand text-white text-xs font-bold shadow-md shadow-purple-600/30 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Congregação</span>
            </button>
          )}

          {/* View Switcher (Map / List / Both) */}
          <div className="flex items-center gap-1 p-1 bg-dark-800/90 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('both')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'both'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tudo
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'map'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Mapa</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Lista</span>
            </button>
          </div>
        </div>
      </div>

      {/* AD Guaratinguetá Instagram Reference Banner */}
      <div className="glass-card rounded-2xl p-3 sm:p-4 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-gradient-to-r from-purple-950/40 via-dark-800 to-dark-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex-shrink-0">
            <InstagramIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-white truncate">
              @adguaratingueta
            </h4>
            <p className="text-[10px] sm:text-xs text-slate-400">
              Cultos, eventos e transmissões ao vivo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-stretch sm:self-auto">
          <button
            onClick={handleGetLocation}
            disabled={isLocating}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold active:scale-95"
          >
            <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'GPS...' : 'Mais Próximas'}</span>
          </button>

          <a
            href="https://www.instagram.com/adguaratingueta/"
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-[11px] font-bold shadow-sm shadow-pink-600/20 active:scale-95"
          >
            <span>Instagram</span>
          </a>
        </div>
      </div>

      {/* Search & Filter Bar (Optimized for Mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por bairro, pastor ou rua..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-dark-800/80 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Neighborhood Filter */}
        <div>
          <select
            value={selectedNeighborhood}
            onChange={(e) => setSelectedNeighborhood(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-dark-800/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
          >
            <option value="Todos">Todos os Bairros</option>
            {neighborhoods.map((n) => (
              <option key={n} value={n}>
                📍 {n}
              </option>
            ))}
          </select>
        </div>

        {/* Culto Day Filter */}
        <div>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-dark-800/80 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
          >
            {daysOfWeek.map((d) => (
              <option key={d} value={d}>
                🗓️ {d === 'Todos' ? 'Todos os Dias' : `Cultos de ${d}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Map Section */}
      {(viewMode === 'both' || viewMode === 'map') && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-purple-400" />
              Mapa ({filteredChurches.length} congregações)
            </span>
            <span className="hidden xs:inline">Toque nos pinos para ver rotas</span>
          </div>
          <ChurchMap
            churches={filteredChurches}
            focusedChurch={focusedChurch}
            userLocation={userCoords}
          />
        </div>
      )}

      {/* Church Cards List */}
      {(viewMode === 'both' || viewMode === 'list') && (
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span className="font-semibold text-slate-300">
              {filteredChurches.length} congregações
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredChurches.map((church) => (
              <ChurchCard
                key={church._id}
                church={church}
                onFocusOnMap={(c) => {
                  setFocusedChurch(c);
                  if (viewMode === 'list') setViewMode('both');
                  window.scrollTo({ top: 100, behavior: 'smooth' });
                }}
                onEdit={onEditChurch}
                onDelete={onDeleteChurch}
              />
            ))}

            {filteredChurches.length === 0 && (
              <div className="text-center py-10 glass-card rounded-2xl p-6 border border-white/5">
                <ChurchIcon className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-xs sm:text-sm font-semibold text-slate-300">
                  Nenhuma igreja encontrada com os filtros selecionados.
                </p>
                {onOpenCreate && (
                  <button
                    onClick={onOpenCreate}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl gradient-brand text-white text-xs font-bold shadow-md shadow-purple-600/30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Cadastrar Primeira Congregação</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
