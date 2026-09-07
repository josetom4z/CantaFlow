import React from 'react';
import {
  X,
  Crown,
  Check,
  Zap,
  WifiOff,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const UpgradeModal = () => {
  const { isUpgradeModalOpen, setIsUpgradeModalOpen, plan, switchPlan, isPro } =
    useAuth();

  if (!isUpgradeModalOpen) return null;

  const handleSelectPlan = async (newPlan) => {
    await switchPlan(newPlan);
    setIsUpgradeModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-purple-500/40 shadow-2xl max-h-[92dvh] overflow-y-auto my-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setIsUpgradeModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-md mx-auto mb-5 sm:mb-8 pr-6 pl-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border border-amber-500/30 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>CantaFlow PRO by PixelLab</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            Eleve o Louvor da Sua Igreja
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Escolha o plano ideal para ministros e bandas
          </p>
        </div>

        {/* Pricing Cards Grid (Free vs Pro) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          
          {/* Card 1: FREE */}
          <div
            className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 border transition-all flex flex-col justify-between ${
              !isPro
                ? 'bg-dark-800 border-purple-500/50 ring-1 ring-purple-500/40'
                : 'glass-card border-white/5 opacity-80 hover:opacity-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Plano Free</h3>
                  <p className="text-[11px] text-slate-400">Para membros e testes</p>
                </div>
                <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                  R$ 0/mês
                </span>
              </div>

              <ul className="space-y-2 text-xs text-slate-300 my-4 sm:my-6">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Upload de até 10 músicas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Organização em pastas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Radar de Igrejas & Google Maps</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Compartilhamento no WhatsApp</span>
                </li>
                <li className="flex items-center gap-2 text-slate-500">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>Exibe anúncios de patrocinadores</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan('free')}
              className={`w-full py-2.5 rounded-xl text-xs font-bold border transition-all ${
                !isPro
                  ? 'bg-white/10 text-white border-white/20'
                  : 'bg-dark-700 text-slate-300 border-white/5 hover:bg-dark-600'
              }`}
            >
              {!isPro ? 'Plano Atual (Ativo)' : 'Mudar para Free'}
            </button>
          </div>

          {/* Card 2: PRO (PixelLab Premium) */}
          <div
            className={`relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 border transition-all flex flex-col justify-between overflow-hidden ${
              isPro
                ? 'bg-gradient-to-b from-purple-950/60 to-dark-800 border-purple-500 ring-2 ring-purple-500/60 shadow-2xl shadow-purple-900/40'
                : 'bg-gradient-to-b from-purple-950/30 to-dark-800 border-purple-500/40 hover:border-purple-400 shadow-xl'
            }`}
          >
            {/* Top highlight ribbon */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-purple-600 text-[9px] sm:text-[10px] font-extrabold uppercase px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-bl-xl text-white shadow-md">
              Mais Recomendado
            </div>

            <div>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-400" />
                    Plano PRO
                  </h3>
                  <p className="text-[11px] text-purple-300">Para ministros e bandas</p>
                </div>
                <div className="text-right">
                  <span className="text-base sm:text-lg font-extrabold text-white">R$ 9,90</span>
                  <span className="text-[10px] text-slate-400">/mês</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-200 my-4 sm:my-6">
                <li className="flex items-center gap-2 font-semibold text-emerald-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>100% SEM ANÚNCIOS</span>
                </li>
                <li className="flex items-center gap-2 font-semibold text-cyan-300">
                  <WifiOff className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>Downloads Offline Ilimitados</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Transposição de Tom (+/- Semitons)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Pastas & Escalas Ilimitadas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Suporte Prioritário PixelLab</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan('pro')}
              className="w-full py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-extrabold text-white gradient-brand shadow-lg shadow-purple-600/40 hover:brightness-110 active:scale-95 transition-all"
            >
              {isPro ? '✓ Você já é PRO (Ativo)' : 'Assinar PRO Agora'}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-4 sm:mt-6 pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[10px] sm:text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Desenvolvido por <strong>PixelLab</strong>
          </span>
          <span>Sem fidelidade • Cancele quando quiser</span>
        </div>
      </div>
    </div>
  );
};
