import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Share2, MapPin } from 'lucide-react';
import { shareChurchOnWhatsApp } from '../../services/whatsappHelper';

// Custom Map center changer component
const MapRecenter = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 14, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
};

// Create custom SVG Leaflet Marker Icon
const createChurchPin = (isSede = false) => {
  const bgColor = isSede ? '#f59e0b' : '#8b5cf6';
  const size = isSede ? 42 : 36;

  const html = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${size}px;
      height: ${size}px;
      background: ${bgColor};
      border: 3px solid #ffffff;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    ">
      <div style="transform: rotate(45deg); color: #ffffff; font-weight: bold; font-size: ${isSede ? '14px' : '12px'};">
        ⛪
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-church-pin',
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

export const ChurchMap = ({
  churches = [],
  focusedChurch = null,
  userLocation = null,
}) => {
  // Default center: Guaratinguetá Centro (Templo Sede)
  const defaultCenter = [-22.8164, -45.1953];
  const activeCenter = focusedChurch
    ? [focusedChurch.location.lat, focusedChurch.location.lng]
    : defaultCenter;

  return (
    <div className="w-full h-[380px] sm:h-[460px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={activeCenter} zoom={focusedChurch ? 16 : 13} />

        {churches.map((church) => {
          if (!church.location || !church.location.lat) return null;

          const isSede = church.isSede;
          const pinIcon = createChurchPin(isSede);

          return (
            <Marker
              key={church._id}
              position={[church.location.lat, church.location.lng]}
              icon={pinIcon}
            >
              <Popup>
                <div className="p-1 min-w-[220px] text-slate-900 font-sans">
                  {isSede && (
                    <span className="inline-block text-[9px] font-bold uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-full mb-1">
                      ⭐ Sede Regional
                    </span>
                  )}
                  <h4 className="font-bold text-sm text-purple-950 mb-1 leading-tight">
                    {church.name}
                  </h4>
                  <p className="text-xs text-slate-700 mb-2">
                    {church.address} — {church.neighborhood}
                  </p>

                  <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200">
                    <button
                      onClick={() => {
                        const destination = encodeURIComponent(
                          `${church.name}, ${church.address}, ${church.neighborhood}, ${church.city}`
                        );
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
                          '_blank'
                        );
                      }}
                      className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-600 text-white text-[11px] font-bold hover:bg-purple-700 shadow-sm"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Abrir Rota</span>
                    </button>

                    <button
                      onClick={() => shareChurchOnWhatsApp(church)}
                      title="Compartilhar no WhatsApp"
                      className="px-2 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700"
                    >
                      <Share2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
