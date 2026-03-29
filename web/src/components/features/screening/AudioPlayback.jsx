import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * AudioPlayback — Playback controls for recorded/uploaded audio.
 *
 * @param {object} props
 * @param {string} props.audioURL - Object URL for the audio blob
 * @param {string} [props.fileName] - Optional file name to display
 * @param {number} [props.duration] - Recording duration in seconds (for display before metadata loads)
 * @param {string} [props.className]
 */
export default function AudioPlayback({ audioURL, fileName, duration, className }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration || 0);
  const [isMuted, setIsMuted] = useState(false);
  const progressRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setTotalDuration(audio.duration);
      }
    };
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => { setIsPlaying(false); setCurrentTime(0); };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [audioURL]);

  // Reset when URL changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (duration) setTotalDuration(duration);
  }, [audioURL, duration]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleSeek = useCallback((e) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar) return;

    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const time = pct * (totalDuration || audio.duration || 0);
    audio.currentTime = time;
    setCurrentTime(time);
  }, [totalDuration]);

  const formatTime = (s) => {
    const sec = Math.floor(s);
    const m = Math.floor(sec / 60);
    return `${m.toString().padStart(2, '0')}:${(sec % 60).toString().padStart(2, '0')}`;
  };

  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-center gap-3 px-4 py-3',
        'bg-surface rounded-xl border border-border/60',
        'shadow-sm',
        className
      )}
    >
      <audio ref={audioRef} src={audioURL} preload="metadata" />

      {/* Play/Pause */}
      <button
        onClick={togglePlay}
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
          'bg-deep-teal/10 text-deep-teal',
          'hover:bg-deep-teal/15 active:bg-deep-teal/20',
          'transition-colors cursor-pointer'
        )}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
      </button>

      {/* Progress bar + times */}
      <div className="flex-1 min-w-0">
        {fileName && (
          <p className="text-[11px] text-text-muted truncate mb-1">{fileName}</p>
        )}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-text-muted tabular-nums w-[38px]">
            {formatTime(currentTime)}
          </span>

          <div
            ref={progressRef}
            onClick={handleSeek}
            className="flex-1 h-2 bg-muted rounded-full overflow-hidden cursor-pointer group relative"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-deep-teal to-sage rounded-full relative"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-deep-teal border-2 border-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          </div>

          <span className="text-[11px] font-mono text-text-muted tabular-nums w-[38px] text-right">
            {formatTime(totalDuration)}
          </span>
        </div>
      </div>

      {/* Mute toggle */}
      <button
        onClick={toggleMute}
        className="p-1.5 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </button>
    </motion.div>
  );
}

AudioPlayback.displayName = 'AudioPlayback';
