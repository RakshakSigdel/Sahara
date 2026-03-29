import { Play, Pause, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

/**
 * Pill-shaped recording controls bar.
 *
 * @param {object} props
 * @param {boolean} props.isRecording
 * @param {boolean} [props.isPaused=false]
 * @param {function} props.onStart
 * @param {function} props.onPause
 * @param {function} props.onStop
 * @param {number} [props.duration=0] - Elapsed seconds
 * @param {string} [props.className]
 */
function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function RecordingControls({
  isRecording,
  isPaused = false,
  onStart,
  onPause,
  onStop,
  duration = 0,
  className,
}) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        'inline-flex items-center gap-4 px-6 py-3',
        'bg-surface/95 backdrop-blur-md border border-border',
        'rounded-full shadow-lg',
        className,
      )}
    >
      {/* Recording indicator */}
      {isRecording && !isPaused && (
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-coral" />
        </span>
      )}

      {/* Timer */}
      <span
        className="text-lg font-bold text-text-primary tabular-nums min-w-[4ch]"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {formatTime(duration)}
      </span>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {!isRecording ? (
          <button
            onClick={onStart}
            className={cn(
              'flex items-center justify-center w-12 h-12 rounded-full',
              'bg-gradient-to-r from-deep-teal to-deep-teal-light text-white',
              'hover:shadow-teal transition-all duration-200',
              'cursor-pointer',
            )}
            aria-label="Start recording"
          >
            <Play size={20} className="ml-0.5" />
          </button>
        ) : (
          <>
            <button
              onClick={onPause}
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full',
                'bg-muted text-text-primary',
                'hover:bg-border transition-colors duration-150',
                'cursor-pointer',
              )}
              aria-label={isPaused ? 'Resume recording' : 'Pause recording'}
            >
              {isPaused ? <Play size={18} className="ml-0.5" /> : <Pause size={18} />}
            </button>

            <button
              onClick={onStop}
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full',
                'bg-coral/10 text-coral',
                'hover:bg-coral/20 transition-colors duration-150',
                'cursor-pointer',
              )}
              aria-label="Stop recording"
            >
              <Square size={16} />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

RecordingControls.displayName = 'RecordingControls';

export { RecordingControls };
export default RecordingControls;
