import React, { useState, useRef, useEffect, useCallback } from 'react';

export const AudioScrubber = ({
  currentTime = 0,
  duration = 0,
  onSeek,
  className = '',
  height = 'h-1.5',
  showThumb = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const dragProgressRef = useRef(0);
  const barRef = useRef(null);

  const currentProgress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const displayProgress = isDragging ? dragProgress : currentProgress;

  const calculateProgress = useCallback((clientX) => {
    if (!barRef.current || duration <= 0) return 0;
    const rect = barRef.current.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    const pos = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return (pos / rect.width) * 100;
  }, [duration]);

  const handleSeekCommit = useCallback((percent) => {
    if (duration > 0 && onSeek) {
      const targetTime = (Math.max(0, Math.min(100, percent)) / 100) * duration;
      onSeek(targetTime);
    }
  }, [duration, onSeek]);

  // Touch Handlers
  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    e.stopPropagation();
    setIsDragging(true);
    const clientX = e.touches[0].clientX;
    const percent = calculateProgress(clientX);
    dragProgressRef.current = percent;
    setDragProgress(percent);
  };

  const handleTouchMove = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    e.stopPropagation();
    const clientX = e.touches[0].clientX;
    const percent = calculateProgress(clientX);
    dragProgressRef.current = percent;
    setDragProgress(percent);
  };

  const handleTouchEnd = (e) => {
    e.stopPropagation();
    setIsDragging(false);
    handleSeekCommit(dragProgressRef.current);
  };

  // Mouse Handlers
  const handleMouseDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    const percent = calculateProgress(e.clientX);
    dragProgressRef.current = percent;
    setDragProgress(percent);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const percent = calculateProgress(e.clientX);
      dragProgressRef.current = percent;
      setDragProgress(percent);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      handleSeekCommit(dragProgressRef.current);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, calculateProgress, handleSeekCommit]);

  return (
    <div
      ref={barRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseDown={handleMouseDown}
      className={`relative w-full py-2.5 sm:py-3 cursor-pointer select-none touch-none ${className}`}
      style={{ touchAction: 'none', WebkitUserSelect: 'none' }}
    >
      {/* Background Track */}
      <div className={`relative w-full ${height} bg-dark-700/90 rounded-full overflow-hidden`}>
        {/* Filled Gradient Bar */}
        <div
          className="h-full gradient-brand rounded-full transition-all duration-75 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, displayProgress))}%` }}
        />
      </div>

      {/* Touch Thumb */}
      {showThumb && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-white shadow-lg ring-2 ring-purple-500/50 pointer-events-none transition-transform ${
            isDragging ? 'scale-125 ring-4 ring-purple-400' : 'scale-100'
          }`}
          style={{ left: `${Math.min(100, Math.max(0, displayProgress))}%` }}
        />
      )}
    </div>
  );
};
