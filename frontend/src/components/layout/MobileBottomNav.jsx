import React from 'react';
import { Music, FolderKanban, MapPin, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MobileBottomNav = ({ activeTab, onTabChange }) => {
  const { isPro, setIsUpgradeModalOpen } = useAuth();

  const navItems = [
    {
      id: 'songs',
      label: 'Músicas',
      icon: Music,
    },
    {
      id: 'folders',
      label: 'Pastas',
      icon: FolderKanban,
    },
    {
      id: 'churches',
      label: 'Igrejas',
      icon: MapPin,
    },
    {
      id: 'pro',
      label: isPro ? 'PRO Ativo' : 'Assinatura',
      icon: Crown,
      highlight: !isPro,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-dock pb-[env(safe-area-inset-bottom,0px)] md:hidden">
      <div className="grid grid-cols-4 h-14 max-w-lg mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'pro') {
                  setIsUpgradeModalOpen(true);
                } else {
                  onTabChange(item.id);
                }
              }}
              className={`relative flex flex-col items-center justify-center gap-0.5 py-1 transition-all ${
                isActive
                  ? 'text-purple-400 font-bold'
                  : item.highlight
                  ? 'text-amber-400 hover:text-amber-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active Indicator Top Pill */}
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-purple-500 rounded-b-full shadow-sm shadow-purple-500" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                {item.highlight && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                )}
              </div>

              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
