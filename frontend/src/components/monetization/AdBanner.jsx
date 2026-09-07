import React, { useState, useEffect } from 'react';
import { Sparkles, ExternalLink, Crown, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_ADS } from '../../services/mockData';

export const AdBanner = ({ position = 'in_feed' }) => {
  const { isPro, setIsUpgradeModalOpen } = useAuth();
  const [adIndex, setAdIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  // If user is Pro, NEVER show ads
  if (isPro || isDismissed) return null;

  const currentAd = INITIAL_ADS[adIndex % INITIAL_ADS.length];

  return (
    <div className="relative glass-card rounded-2xl p-4 sm:p-5 border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-dark-800 to-indigo-950/30 shadow-lg shadow-purple-950/20 overflow-hidden my-4">
      
      {/* Decorative Background Glow */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Ad Info */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex-shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                {currentAd.badgeText || 'Patrocinado • PixelLab'}
              </span>
              <span className="text-xs text-slate-400 font-medium truncate">
                {currentAd.advertiser}
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-bold text-white leading-tight">
              {currentAd.title}
            </h4>
            <p className="text-xs text-slate-300 mt-1 line-clamp-2">
              {currentAd.tagline}
            </p>
          </div>
        </div>

        {/* Ad CTA & Remove Ads Trigger */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto flex-shrink-0">
          
          {/* Target link */}
          {currentAd.targetUrl.startsWith('#') ? (
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl gradient-brand text-white text-xs font-bold shadow-md shadow-purple-600/20 hover:brightness-110 transition-all active:scale-95"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{currentAd.ctaText}</span>
            </button>
          ) : (
            <a
              href={currentAd.targetUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-dark-700 hover:bg-dark-600 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
            >
              <span>{currentAd.ctaText}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}

          {/* Upgrade prompt to remove ads */}
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="text-[11px] text-purple-400 hover:text-purple-300 font-bold underline px-1"
          >
            Remover anúncios
          </button>
        </div>
      </div>
    </div>
  );
};
