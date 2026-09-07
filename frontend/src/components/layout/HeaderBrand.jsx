import React from 'react';
import { Sparkles, Wifi, WifiOff, Crown, Radio, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOffline } from '../../context/OfflineContext';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

export const HeaderBrand = ({ onOpenUpload }) => {
  const { plan, isPro, setIsUpgradeModalOpen } = useAuth();
  const { isOnline } = useOffline();
  const { isPlaying } = useAudioPlayer();

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-white/10 px-3 py-2.5 sm:px-6 sm:py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="relative flex-shrink-0 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl gradient-brand shadow-lg shadow-purple-500/20">
            <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-cyan-500"></span>
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-base sm:text-xl font-extrabold tracking-tight text-white flex items-center">
                CantaFlow
              </h1>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                PixelLab
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              Gestão de Louvor & Radar de Igrejas • AD Guaratinguetá
            </p>
          </div>
        </div>

        {/* Right Action Badges */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          
          {/* Online / Offline Status Pill */}
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg sm:rounded-full text-[11px] font-semibold border ${
              isOnline
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
            }`}
            title={isOnline ? 'Online conectado' : 'Modo Offline Ativo'}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3" />
                <span className="hidden sm:inline">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" />
                <span>Offline</span>
              </>
            )}
          </div>

          {/* Plan Badge (Free vs Pro) */}
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              isPro
                ? 'bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20'
                : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
            }`}
          >
            <Crown className={`w-3 h-3 ${isPro ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>{isPro ? 'PRO' : 'Free'}</span>
          </button>

          {/* Upload Song Button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center justify-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold text-white gradient-brand shadow-md shadow-purple-600/30 hover:opacity-95 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">Música</span>
          </button>
        </div>
      </div>
    </header>
  );
};
