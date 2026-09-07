import React from 'react';
import {
  MapPin,
  Navigation,
  Share2,
  Calendar,
  Clock,
  User,
  Phone,
  Compass,
  Edit2,
  Trash2,
  Church as ChurchIcon,
} from 'lucide-react';
import { shareChurchOnWhatsApp } from '../../services/whatsappHelper';

const InstagramIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export const ChurchCard = ({ church, onFocusOnMap, onEdit, onDelete }) => {
  const openGoogleMapsRoute = () => {
    const destination = encodeURIComponent(
      `${church.name}, ${church.address}, ${church.neighborhood}, ${church.city} - ${church.state}`
    );
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(url, '_blank');
  };

  return (
    <div
      className={`glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 transition-all border duration-200 overflow-hidden ${
        church.isSede
          ? 'border-purple-500/50 bg-purple-950/25 shadow-xl shadow-purple-950/40 ring-1 ring-purple-500/30'
          : 'border-white/10 hover:border-purple-500/30 hover:bg-dark-800/70'
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        
        {/* Church Photo (Left / Top on Mobile) */}
        {church.photoUrl && (
          <div className="relative w-full sm:w-48 h-36 sm:h-auto rounded-2xl overflow-hidden flex-shrink-0 bg-dark-900 border border-white/10 shadow-md">
            <img
              src={church.photoUrl}
              alt={church.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1548625361-195fe578cb26?auto=format&fit=crop&w=800&q=80';
              }}
            />
            {church.isSede && (
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-purple-600 text-white shadow-md">
                ⭐ Sede
              </div>
            )}
          </div>
        )}

        {/* Church Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {/* Header badges & Actions */}
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                {church.isSede && !church.photoUrl && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-purple-600 text-white shadow-sm shadow-purple-500/20">
                    ⭐ Sede Regional
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {church.neighborhood}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {church.city}
                </span>
                {church.distanceKm !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                    <Compass className="w-3 h-3" />
                    {church.distanceKm} km
                  </span>
                )}
              </div>

              {/* Edit & Delete Action Buttons */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {onEdit && (
                  <button
                    onClick={() => onEdit(church)}
                    title="Editar congregação"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-600/30 text-slate-400 hover:text-purple-300 border border-white/10 transition-all active:scale-95"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(church._id)}
                    title="Excluir congregação"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-600/30 text-slate-400 hover:text-rose-300 border border-white/10 transition-all active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Church Name */}
            <h3 className="text-sm sm:text-lg font-bold text-white tracking-tight leading-snug">
              {church.name}
            </h3>

            {/* Address */}
            <p className="text-xs text-slate-300 flex items-start gap-1.5 mt-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-2">{church.address} — {church.neighborhood}, {church.city}</span>
            </p>

            {/* Pastor & Contact */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-400">
              {church.pastor && (
                <p className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span>{church.pastor}</span>
                </p>
              )}
              {church.phone && (
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span>{church.phone}</span>
                </p>
              )}
            </div>

            {/* Schedule of Cultos */}
            {church.cultosSchedule && church.cultosSchedule.length > 0 && (
              <div className="mt-2.5 pt-2 border-t border-white/5">
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Cronograma Semanal de Cultos:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {church.cultosSchedule.map((c, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-1.5 rounded-xl bg-dark-900/70 border border-white/5 text-[11px] sm:text-xs text-slate-300"
                    >
                      <Clock className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="font-semibold text-white">{c.day} às {c.time}</span>
                        <p className="text-[10px] text-slate-400 truncate">{c.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons (Google Maps Route & WhatsApp) */}
          <div className="flex flex-col xs:flex-row sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-3 mt-3 border-t border-white/5">
            
            <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
              {/* Abrir Rota no Google Maps */}
              <button
                onClick={openGoogleMapsRoute}
                className="flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold shadow-md shadow-cyan-600/20 active:scale-95 transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Rota Maps</span>
              </button>

              {/* Compartilhar no WhatsApp */}
              <button
                onClick={() => shareChurchOnWhatsApp(church)}
                title="Compartilhar no WhatsApp"
                className="flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold active:scale-95 transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>

            {/* Instagram Link & Pin Focus */}
            <div className="flex items-center justify-between sm:justify-end gap-2.5 text-xs text-slate-400 mt-1 sm:mt-0">
              {church.instagram && (
                <a
                  href={church.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-purple-300 text-[11px]"
                >
                  <InstagramIcon className="w-3 h-3 text-pink-400" />
                  <span>@adguaratingueta</span>
                </a>
              )}
              {onFocusOnMap && (
                <button
                  onClick={() => onFocusOnMap(church)}
                  className="text-purple-400 hover:text-purple-300 text-[11px] font-semibold underline"
                >
                  Ver no Mapa
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
