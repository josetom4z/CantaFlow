import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Church as ChurchIcon,
  MapPin,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Compass,
  Star,
  User,
  Phone,
  Link as LinkIcon,
  Check,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api';

const DEFAULT_DAYS = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

const QUICK_PRESETS = [
  { day: 'Domingo', time: '19:00', name: 'Grande Culto da Família', description: 'Celebração com louvor e pregação' },
  { day: 'Domingo', time: '09:00', name: 'Escola Bíblica Dominical (EBD)', description: 'Estudo das Escrituras para todas as idades' },
  { day: 'Terça-feira', time: '19:30', name: 'Culto de Doutrina e Ensino', description: 'Edificação bíblica profunda' },
  { day: 'Quinta-feira', time: '19:30', name: 'Culto de Vitória e Oração', description: 'Campanha de milagres e intercessão' },
  { day: 'Sábado', time: '19:30', name: 'Culto de Jovens — UMADG', description: 'Louvor jovem e comunhão' },
];

export const ChurchFormModal = ({ isOpen, onClose, onSave, editingChurch = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    neighborhood: '',
    address: '',
    city: 'Guaratinguetá',
    state: 'SP',
    postalCode: '12500-000',
    lat: -22.8164,
    lng: -45.1953,
    googleMapsUrl: '',
    pastor: '',
    phone: '(12) 3122-0000',
    instagram: 'https://www.instagram.com/adguaratingueta/',
    photoUrl: 'https://images.unsplash.com/photo-1548625361-195fe578cb26?auto=format&fit=crop&w=800&q=80',
    isSede: false,
    cultosSchedule: [
      { day: 'Domingo', time: '19:00', name: 'Culto da Família', description: 'Celebração e louvor' },
      { day: 'Terça-feira', time: '19:30', name: 'Culto de Doutrina', description: 'Estudo bíblico' },
      { day: 'Quinta-feira', time: '19:30', name: 'Culto de Vitória', description: 'Oração e milagres' },
    ],
  });

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'schedule' | 'location'
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingChurch) {
      setFormData({
        name: editingChurch.name || '',
        neighborhood: editingChurch.neighborhood || '',
        address: editingChurch.address || '',
        city: editingChurch.city || 'Guaratinguetá',
        state: editingChurch.state || 'SP',
        postalCode: editingChurch.postalCode || '12500-000',
        lat: editingChurch.location?.lat ?? -22.8164,
        lng: editingChurch.location?.lng ?? -45.1953,
        googleMapsUrl: editingChurch.googleMapsUrl || '',
        pastor: editingChurch.pastor || '',
        phone: editingChurch.phone || '(12) 3122-0000',
        instagram: editingChurch.instagram || 'https://www.instagram.com/adguaratingueta/',
        photoUrl: editingChurch.photoUrl || '',
        isSede: Boolean(editingChurch.isSede),
        cultosSchedule: editingChurch.cultosSchedule && editingChurch.cultosSchedule.length > 0
          ? editingChurch.cultosSchedule
          : [
              { day: 'Domingo', time: '19:00', name: 'Culto da Família', description: 'Celebração e louvor' },
            ],
      });
      setPhotoPreview(editingChurch.photoUrl || '');
    } else {
      setFormData({
        name: '',
        neighborhood: '',
        address: '',
        city: 'Guaratinguetá',
        state: 'SP',
        postalCode: '12500-000',
        lat: -22.8164,
        lng: -45.1953,
        googleMapsUrl: '',
        pastor: '',
        phone: '(12) 3122-0000',
        instagram: 'https://www.instagram.com/adguaratingueta/',
        photoUrl: 'https://images.unsplash.com/photo-1548625361-195fe578cb26?auto=format&fit=crop&w=800&q=80',
        isSede: false,
        cultosSchedule: [
          { day: 'Domingo', time: '19:00', name: 'Culto da Família', description: 'Celebração e louvor' },
          { day: 'Terça-feira', time: '19:30', name: 'Culto de Doutrina', description: 'Estudo bíblico' },
          { day: 'Quinta-feira', time: '19:30', name: 'Culto de Vitória', description: 'Oração e milagres' },
        ],
      });
      setPhotoPreview('https://images.unsplash.com/photo-1548625361-195fe578cb26?auto=format&fit=crop&w=800&q=80');
    }
  }, [editingChurch, isOpen]);

  if (!isOpen) return null;

  // Handle Photo File Upload
  const handlePhotoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);

    try {
      setIsUploadingPhoto(true);
      const res = await api.uploadChurchPhoto(file);
      if (res?.photoUrl) {
        setFormData((prev) => ({ ...prev, photoUrl: res.photoUrl }));
        setPhotoPreview(res.photoUrl);
      }
    } catch (err) {
      console.warn('Erro no upload da foto, mantendo preview local:', err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Handle GPS Capture
  const handleCaptureGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não disponível no navegador.');
      return;
    }
    setIsGettingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
        }));
        setIsGettingGps(false);
      },
      (err) => {
        alert('Não foi possível obter coordenadas GPS: ' + err.message);
        setIsGettingGps(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Schedule Handlers
  const handleAddCulto = () => {
    setFormData((prev) => ({
      ...prev,
      cultosSchedule: [
        ...prev.cultosSchedule,
        { day: 'Domingo', time: '19:00', name: 'Culto de Louvor', description: '' },
      ],
    }));
  };

  const handleApplyPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      cultosSchedule: [...prev.cultosSchedule, { ...preset }],
    }));
  };

  const handleUpdateCulto = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.cultosSchedule];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, cultosSchedule: updated };
    });
  };

  const handleRemoveCulto = (index) => {
    setFormData((prev) => ({
      ...prev,
      cultosSchedule: prev.cultosSchedule.filter((_, i) => i !== index),
    }));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.neighborhood.trim() || !formData.address.trim()) {
      alert('Por favor, preencha o Nome, Bairro e Endereço da congregação.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        neighborhood: formData.neighborhood.trim(),
        address: formData.address.trim(),
        city: formData.city.trim() || 'Guaratinguetá',
        state: formData.state.trim() || 'SP',
        postalCode: formData.postalCode.trim() || '12500-000',
        location: {
          lat: parseFloat(formData.lat) || -22.8164,
          lng: parseFloat(formData.lng) || -45.1953,
        },
        googleMapsUrl:
          formData.googleMapsUrl.trim() ||
          `https://maps.google.com/?q=${encodeURIComponent(
            `${formData.name}, ${formData.address}, ${formData.neighborhood}, ${formData.city}`
          )}`,
        pastor: formData.pastor.trim() || 'Pr. Dirigente',
        phone: formData.phone.trim() || '(12) 3122-0000',
        instagram: formData.instagram.trim() || 'https://www.instagram.com/adguaratingueta/',
        photoUrl: formData.photoUrl.trim() || photoPreview,
        isSede: formData.isSede,
        cultosSchedule: formData.cultosSchedule,
      };

      await onSave(payload, editingChurch?._id);
      onClose();
    } catch (err) {
      console.error('Erro ao salvar igreja:', err);
      alert('Erro ao salvar congregação. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#11131f] border border-purple-500/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-white/10 flex items-center justify-between bg-dark-900/80 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl gradient-brand text-white shadow-md shadow-purple-600/30">
              <ChurchIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                {editingChurch ? 'Editar Congregação' : 'Cadastrar Nova Igreja'}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                AD Guaratinguetá e Vale do Paraíba
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-white/10 bg-dark-800/60 px-4 sm:px-6 py-2 gap-2 flex-shrink-0 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'general'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ChurchIcon className="w-3.5 h-3.5" />
            <span>Dados & Foto</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'schedule'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Cultos ({formData.cultosSchedule.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('location')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'location'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Endereço & Maps</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* TAB 1: DADOS GERAIS & FOTO */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              
              {/* Photo Upload & Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Foto da Congregação / Fachada
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative w-full sm:w-44 h-28 rounded-2xl overflow-hidden border border-white/15 bg-dark-800 flex-shrink-0 shadow-inner group">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Fachada"
                        className="w-full h-full object-cover"
                        onError={() => setPhotoPreview('https://images.unsplash.com/photo-1548625361-195fe578cb26?auto=format&fit=crop&w=800&q=80')}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                        <ImageIcon className="w-8 h-8 mb-1" />
                        <span className="text-[10px]">Sem foto</span>
                      </div>
                    )}
                    {isUploadingPhoto && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-xs text-purple-300 font-semibold">
                        Enviando foto...
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all active:scale-95"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isUploadingPhoto ? 'Enviando...' : 'Selecionar Foto do Celular/PC'}</span>
                    </button>

                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="url"
                        placeholder="Ou cole o link da foto (URL)..."
                        value={formData.photoUrl}
                        onChange={(e) => {
                          setFormData({ ...formData, photoUrl: e.target.value });
                          setPhotoPreview(e.target.value);
                        }}
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-dark-800/90 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Is Sede Regional Toggle */}
              <div
                onClick={() => setFormData({ ...formData, isSede: !formData.isSede })}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  formData.isSede
                    ? 'bg-purple-950/40 border-purple-500/60 ring-1 ring-purple-500/40 shadow-lg shadow-purple-950/30'
                    : 'bg-dark-800/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${formData.isSede ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      É o Templo Sede Regional?
                    </h4>
                    <p className="text-[10px] sm:text-xs text-slate-400">
                      Destaca a congregação como matriz no radar e no mapa
                    </p>
                  </div>
                </div>

                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                  formData.isSede ? 'bg-purple-600 border-purple-400 text-white' : 'border-white/20'
                }`}>
                  {formData.isSede && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>

              {/* Church Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Nome da Congregação *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Assembleia de Deus — Pedregulho"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800/90 border border-white/10 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Pastor & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Pastor / Dirigente Local
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Ex: Pr. Carlos Silva & Família"
                      value={formData.pastor}
                      onChange={(e) => setFormData({ ...formData, pastor: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-dark-800/90 border border-white/10 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Telefone / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Ex: (12) 3122-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-dark-800/90 border border-white/10 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Instagram URL */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Link do Instagram
                </label>
                <input
                  type="url"
                  placeholder="https://www.instagram.com/adguaratingueta/"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-dark-800/90 border border-white/10 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* TAB 2: CRONOGRAMA SEMANAL DE CULTOS */}
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              
              {/* Quick Presets */}
              <div className="p-3 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-2">
                <p className="text-[11px] font-bold text-purple-300 flex items-center gap-1 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Adicionar Cultos Pré-definidos:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="px-2.5 py-1 rounded-lg bg-dark-800/90 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 text-[10px] sm:text-xs font-semibold transition-all active:scale-95"
                    >
                      + {preset.day} {preset.time} ({preset.name})
                    </button>
                  ))}
                </div>
              </div>

              {/* Cultos List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Cultos da Semana ({formData.cultosSchedule.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddCulto}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Novo Culto</span>
                  </button>
                </div>

                {formData.cultosSchedule.map((culto, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-2xl bg-dark-800/80 border border-white/10 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-purple-400">
                        Culto #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCulto(index)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Remover culto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                          Dia da Semana
                        </label>
                        <select
                          value={culto.day}
                          onChange={(e) => handleUpdateCulto(index, 'day', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-dark-900 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                        >
                          {DEFAULT_DAYS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                          Horário (ex: 19:30)
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                          <input
                            type="text"
                            placeholder="19:30"
                            value={culto.time}
                            onChange={(e) => handleUpdateCulto(index, 'time', e.target.value)}
                            className="w-full pl-7 pr-2 py-1.5 rounded-lg bg-dark-900 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                          Nome do Culto
                        </label>
                        <input
                          type="text"
                          placeholder="Culto da Família"
                          value={culto.name}
                          onChange={(e) => handleUpdateCulto(index, 'name', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-dark-900 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Descrição opcional (ex: Louvor com orquestra, oração pelos enfermos...)"
                        value={culto.description || ''}
                        onChange={(e) => handleUpdateCulto(index, 'description', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-dark-900/60 border border-white/5 text-slate-300 text-[11px] placeholder-slate-600 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                ))}

                {formData.cultosSchedule.length === 0 && (
                  <div className="text-center py-6 bg-dark-800/40 rounded-2xl border border-white/5 p-4 text-xs text-slate-400">
                    Nenhum culto cadastrado. Clique em "+ Novo Culto" ou use os presets acima.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ENDEREÇO & GEOLOCALIZAÇÃO */}
          {activeTab === 'location' && (
            <div className="space-y-3.5">
              
              {/* Address Fields */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Logradouro e Número *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Rua Domingos Rodrigues Alves, 417"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-dark-800/90 border border-white/10 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Centro"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-800/90 border border-white/10 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    placeholder="Guaratinguetá"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-800/90 border border-white/10 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    CEP
                  </label>
                  <input
                    type="text"
                    placeholder="12500-000"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-800/90 border border-white/10 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>

              {/* GPS Coordinates Section */}
              <div className="p-3.5 rounded-2xl bg-dark-800/80 border border-cyan-500/20 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-cyan-400" />
                      Coordenadas GPS para o Mapa
                    </h5>
                    <p className="text-[10px] text-slate-400">
                      Necessário para posicionar o pino com precisão no mapa interativo
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCaptureGps}
                    disabled={isGettingGps}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold active:scale-95 transition-all"
                  >
                    <MapPin className={`w-3.5 h-3.5 ${isGettingGps ? 'animate-spin' : ''}`} />
                    <span>{isGettingGps ? 'Obtendo GPS...' : 'Usar Meu GPS Atual'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="-22.8164"
                      value={formData.lat}
                      onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-dark-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="-45.1953"
                      value={formData.lng}
                      onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-dark-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Google Maps Route URL */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Link Direto do Google Maps (Opcional)
                </label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/?q=..."
                  value={formData.googleMapsUrl}
                  onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-dark-800/90 border border-white/10 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Se deixado em branco, será gerado automaticamente com o nome e endereço.
                </p>
              </div>
            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2.5 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 text-xs sm:text-sm font-semibold transition-all"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-brand text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 active:scale-95 transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Salvando...' : editingChurch ? 'Salvar Alterações' : 'Cadastrar Igreja'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
