import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Repeat1,
  Share2,
  Download,
  CheckCircle2,
  ChevronDown,
  Music,
  Gauge,
  Sliders,
  ListMusic,
} from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { useOffline } from '../../context/OfflineContext';
import { shareSongOnWhatsApp } from '../../services/whatsappHelper';
import { AudioScrubber } from './AudioScrubber';

// Chord transpose table
const scale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const transposeChord = (chord, semitones) => {
  if (semitones === 0) return chord;
  return chord.replace(/[A-G][#b]?/g, (match) => {
    let normalized = match;
    if (match === 'Db') normalized = 'C#';
    if (match === 'Eb') normalized = 'D#';
    if (match === 'Gb') normalized = 'F#';
    if (match === 'Ab') normalized = 'G#';
    if (match === 'Bb') normalized = 'A#';

    const index = scale.indexOf(normalized);
    if (index === -1) return match;
    let newIndex = (index + semitones) % 12;
    if (newIndex < 0) newIndex += 12;
    return scale[newIndex];
  });
};

export const FullScreenPlayerModal = () => {
  const {
    currentSong,
    queue,
    isPlaying,
    togglePlay,
    handleNextTrack,
    handlePrevTrack,
    currentTime,
    duration,
    seek,
    playbackRate,
    setPlaybackRate,
    isShuffle,
    setIsShuffle,
    loopMode,
    toggleLoopMode,
    isFullScreenOpen,
    setIsFullScreenOpen,
    transposeSemitones,
    setTransposeSemitones,
    formatTime,
    playSong,
  } = useAudioPlayer();

  const { isSongDownloaded, toggleDownloadSong } = useOffline();
  const [activeTab, setActiveTab] = useState('lyrics'); // 'lyrics' | 'queue' | 'chords'

  if (!isFullScreenOpen || !currentSong) return null;

  const isDownloaded = isSongDownloaded(currentSong._id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Render chords with transposition applied
  const renderTransposedChords = () => {
    const rawChords = currentSong.chords || currentSong.lyrics || 'Nenhuma cifra cadastrada para este louvor.';
    if (transposeSemitones === 0) return rawChords;

    return rawChords
      .split('\n')
      .map((line) => transposeChord(line, transposeSemitones))
      .join('\n');
  };

  const speedOptions = [0.75, 1, 1.25, 1.5];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#090a0f] text-slate-100 h-[100dvh] overflow-hidden">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-white/10 glass-panel flex-shrink-0">
        <button
          onClick={() => setIsFullScreenOpen(false)}
          className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <div className="text-center min-w-0 px-2 flex-1">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-purple-400 truncate">
            CantaFlow • AD Guaratinguetá
          </p>
          <h3 className="text-xs sm:text-base font-bold text-white truncate max-w-[220px] sm:max-w-md mx-auto">
            {currentSong.title}
          </h3>
        </div>

        <button
          onClick={() => shareSongOnWhatsApp(currentSong)}
          title="Compartilhar no WhatsApp"
          className="p-1.5 sm:p-2 rounded-xl text-emerald-400 hover:bg-emerald-500/10 transition-colors"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area (Tabs: Lyrics / Chords / Queue) */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 max-w-4xl mx-auto w-full flex flex-col justify-between">
        
        {/* Navigation Sub-Tabs */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-4 flex-shrink-0">
          <button
            onClick={() => setActiveTab('lyrics')}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'lyrics'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-dark-800 text-slate-400 hover:text-white'
            }`}
          >
            Letra
          </button>
          <button
            onClick={() => setActiveTab('chords')}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'chords'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-dark-800 text-slate-400 hover:text-white'
            }`}
          >
            Cifras ({transposeSemitones >= 0 ? `+${transposeSemitones}` : transposeSemitones})
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`flex items-center gap-1 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'queue'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-dark-800 text-slate-400 hover:text-white'
            }`}
          >
            <ListMusic className="w-3.5 h-3.5" />
            <span>Fila ({queue.length})</span>
          </button>
        </div>

        {/* Tab 1: Lyrics */}
        {activeTab === 'lyrics' && (
          <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/5 my-auto max-h-[48vh] sm:max-h-[420px] overflow-y-auto">
            {currentSong.lyrics ? (
              <pre className="font-sans text-sm sm:text-lg leading-relaxed text-slate-200 whitespace-pre-wrap text-center">
                {currentSong.lyrics}
              </pre>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Music className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-xs">Nenhuma letra sincronizada.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Chords & Key Transposer */}
        {activeTab === 'chords' && (
          <div className="space-y-3 my-auto max-h-[50vh] sm:max-h-[440px] flex flex-col">
            {/* Chord Transposition Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 sm:p-3.5 rounded-xl bg-dark-800/90 border border-purple-500/20 text-xs">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-bold text-white">Tom:</span>
                <span className="font-mono font-bold text-amber-300">
                  {transposeChord(currentSong.keySignature || 'G', transposeSemitones)}
                </span>
                <span className="text-[10px] text-slate-400">
                  ({currentSong.keySignature || 'G'})
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setTransposeSemitones((prev) => prev - 1)}
                  className="px-2 py-1 rounded-lg bg-dark-700 hover:bg-dark-600 text-[11px] font-bold text-purple-300 border border-white/10"
                >
                  -1 Semitom
                </button>
                <button
                  onClick={() => setTransposeSemitones(0)}
                  className="px-2 py-1 rounded-lg bg-dark-700 hover:bg-dark-600 text-[11px] font-medium text-slate-300 border border-white/10"
                >
                  Reset
                </button>
                <button
                  onClick={() => setTransposeSemitones((prev) => prev + 1)}
                  className="px-2 py-1 rounded-lg bg-dark-700 hover:bg-dark-600 text-[11px] font-bold text-purple-300 border border-white/10"
                >
                  +1 Semitom
                </button>
              </div>
            </div>

            {/* Chords Viewer */}
            <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/5 flex-1 overflow-y-auto">
              <pre className="font-mono text-xs sm:text-base leading-relaxed text-amber-200/95 whitespace-pre-wrap">
                {renderTransposedChords()}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 3: Queue */}
        {activeTab === 'queue' && (
          <div className="glass-card rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-white/5 space-y-1.5 max-h-[48vh] sm:max-h-[420px] overflow-y-auto">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Próximas Músicas na Escala ({queue.length})
            </h4>
            {queue.map((s, idx) => {
              const isPlayingThis = currentSong._id === s._id;
              return (
                <div
                  key={s._id || idx}
                  onClick={() => playSong(s)}
                  className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl cursor-pointer transition-all ${
                    isPlayingThis
                      ? 'bg-purple-600/20 border border-purple-500/50 text-purple-300'
                      : 'bg-dark-800/60 hover:bg-dark-700 border border-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-mono font-bold opacity-60 w-4">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-white truncate">
                        {s.title}
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                        {s.artist} • Tom {s.keySignature || 'G'}
                      </p>
                    </div>
                  </div>
                  {isPlayingThis && (
                    <span className="text-[10px] font-bold text-purple-400 flex-shrink-0">
                      Tocando
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Audio Controller Section */}
        <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] flex-shrink-0">
          
          {/* Progress Bar & Seek */}
          <div className="space-y-0.5">
            <AudioScrubber
              currentTime={currentTime}
              duration={duration}
              onSeek={seek}
              height="h-2"
              showThumb={true}
            />
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono -mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Controls (Shuffle, Prev, Play, Next, Loop) */}
          <div className="flex items-center justify-between max-w-sm mx-auto px-2">
            <button
              onClick={setIsShuffle}
              className={`p-2.5 rounded-xl transition-all ${
                isShuffle ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-white'
              }`}
              title="Aleatório"
            >
              <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={handlePrevTrack}
              className="p-2.5 text-slate-300 hover:text-white active:scale-95 transition-all"
            >
              <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={togglePlay}
              className="w-13 h-13 sm:w-16 sm:h-16 rounded-full gradient-brand text-white flex items-center justify-center shadow-xl shadow-purple-600/40 active:scale-95 transition-all"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
              ) : (
                <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-0.5 fill-current" />
              )}
            </button>

            <button
              onClick={handleNextTrack}
              className="p-2.5 text-slate-300 hover:text-white active:scale-95 transition-all"
            >
              <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={toggleLoopMode}
              className={`p-2.5 rounded-xl transition-all ${
                loopMode !== 'off'
                  ? 'text-purple-400 bg-purple-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={`Repetição: ${loopMode}`}
            >
              {loopMode === 'one' ? (
                <Repeat1 className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>

          {/* Speed / Tempo & Offline Download Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px]">
            <div className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-slate-400 font-semibold mr-0.5 hidden xs:inline">Vel:</span>
              {speedOptions.map((rate) => (
                <button
                  key={rate}
                  onClick={() => setPlaybackRate(rate)}
                  className={`px-1.5 py-0.5 rounded font-mono font-bold transition-all ${
                    playbackRate === rate
                      ? 'bg-purple-600 text-white'
                      : 'bg-dark-800 text-slate-400'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            <button
              onClick={() => toggleDownloadSong(currentSong)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border font-semibold transition-all ${
                isDownloaded
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              {isDownloaded ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Offline</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
