import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Mic, Pause, Play, Square, RotateCcw, X,
  BookOpen, Zap, Image as ImageIcon, AlertTriangle, Volume2,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { cn } from '../../utils/cn';

/* ═══════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════ */
const testConfig = {
  quick: {
    label: 'Quick Screen',
    icon: <Zap size={14} />,
    prompt: 'Please count backwards from 20 to 1. Take your time and speak clearly.',
    minSeconds: 15,
    steps: 1,
  },
  story: {
    label: 'Story Recall',
    icon: <BookOpen size={14} />,
    prompt: 'Listen carefully to this short story, then retell it in your own words. Focus on as many details as you can remember.',
    minSeconds: 30,
    steps: 3,
  },
  picture: {
    label: 'Picture Description',
    icon: <ImageIcon size={14} />,
    prompt: 'Describe everything you see in this image. Include colors, objects, people, and any actions taking place.',
    minSeconds: 25,
    steps: 2,
  },
};

/* ═══════════════════════════════════════════
   WAVEFORM VISUALIZER (Canvas)
   ═══════════════════════════════════════════ */
function WaveformVisualizer({ isRecording, isPaused }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const barsRef = useRef(Array.from({ length: 56 }, () => 0.1));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const bars = barsRef.current;
      const barCount = bars.length;
      const totalWidth = w * 0.7;
      const startX = (w - totalWidth) / 2;
      const barWidth = (totalWidth / barCount) * 0.65;
      const gap = (totalWidth / barCount) * 0.35;
      const maxH = h * 0.65;
      const centerY = h / 2;

      bars.forEach((val, i) => {
        // Target value
        let target;
        if (!isRecording || isPaused) {
          target = 0.05 + Math.sin(Date.now() * 0.002 + i * 0.3) * 0.04;
        } else {
          target = 0.15 + Math.random() * 0.7 + Math.sin(Date.now() * 0.003 + i * 0.4) * 0.15;
        }
        bars[i] += (target - bars[i]) * 0.12;

        const barH = Math.max(4 * dpr, bars[i] * maxH);
        const x = startX + i * (barWidth + gap);

        // Gradient per bar
        const gradient = ctx.createLinearGradient(0, centerY - barH / 2, 0, centerY + barH / 2);
        const progress = i / barCount;
        const alpha = isRecording && !isPaused ? 0.9 : 0.35;
        gradient.addColorStop(0, `rgba(10, 124, 124, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(14, 154, 154, ${alpha})`);
        gradient.addColorStop(1, `rgba(168, 213, 181, ${alpha * 0.7})`);

        ctx.beginPath();
        ctx.roundRect(x, centerY - barH / 2, barWidth, barH, barWidth / 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isRecording, isPaused]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

/* ═══════════════════════════════════════════
   TIMER
   ═══════════════════════════════════════════ */
function Timer({ seconds, minSeconds }) {
  const min = String(Math.floor(seconds / 60)).padStart(2, '0');
  const sec = String(seconds % 60).padStart(2, '0');
  const progress = Math.min(seconds / minSeconds, 1);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        {/* Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="35" fill="none" stroke="#E2E8E5" strokeWidth="3" />
          <motion.circle
            cx="40" cy="40" r="35" fill="none" stroke="#0A7C7C" strokeWidth="3"
            strokeLinecap="round" strokeDasharray={2 * Math.PI * 35}
            animate={{ strokeDashoffset: 2 * Math.PI * 35 * (1 - progress) }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-navy-dark" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {min}:{sec}
          </span>
        </div>
      </div>
      <span className="text-[10px] text-text-muted mt-1.5 uppercase tracking-wider font-medium">
        {seconds >= minSeconds ? 'Ready' : 'Recording'}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   VOLUME METER
   ═══════════════════════════════════════════ */
function VolumeMeter({ active }) {
  const [level, setLevel] = useState(0.4);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setLevel(0.3 + Math.random() * 0.5), 200);
    return () => clearInterval(id);
  }, [active]);

  const color = level < 0.3 ? 'bg-warning' : level > 0.85 ? 'bg-error' : 'bg-success';

  return (
    <div className="hidden lg:flex flex-col items-center gap-2">
      <Volume2 size={14} className="text-text-muted" />
      <div className="w-2 h-28 rounded-full bg-muted overflow-hidden flex flex-col-reverse">
        <motion.div className={cn('w-full rounded-full', color)} animate={{ height: `${level * 100}%` }} transition={{ duration: 0.15 }} />
      </div>
      <span className="text-[9px] text-text-muted uppercase tracking-wider font-medium">Vol</span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   EXIT CONFIRM MODAL
   ═══════════════════════════════════════════ */
function ExitModal({ open, onClose, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/40 backdrop-blur-sm px-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-surface rounded-xl shadow-xl border border-border/50 p-6 max-w-sm w-full">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-warning" />
          </div>
          <div>
            <h3 className="text-base font-bold text-navy-dark">Exit Recording?</h3>
            <p className="text-sm text-text-secondary mt-1">Your current recording will be lost. Are you sure?</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={onConfirm} className="flex-1">Exit</Button>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   FEEDBACK TOAST
   ═══════════════════════════════════════════ */
function FeedbackToast({ message, type, visible }) {
  const styles = {
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    info: 'bg-info/10 text-info border-info/20',
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 80, opacity: 0 }}
          className={cn('fixed top-24 right-6 z-30 px-4 py-2.5 rounded-lg border text-xs font-semibold shadow-md', styles[type])}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════
   RECORDING PAGE
   ═══════════════════════════════════════════ */
export default function RecordingPage() {
  const [searchParams] = useSearchParams();
  const testType = searchParams.get('type') || 'quick';
  const config = testConfig[testType] || testConfig.quick;
  const navigate = useNavigate();

  const [state, setState] = useState('idle'); // idle | recording | paused | done
  const [seconds, setSeconds] = useState(0);
  const [showExit, setShowExit] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: 'info', visible: false });
  const timerRef = useRef(null);

  // Timer
  useEffect(() => {
    if (state === 'recording') {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [state]);

  // Feedback tips
  useEffect(() => {
    if (state !== 'recording') return;
    const tips = [
      { msg: 'Great! Speaking clearly', type: 'success', at: 5 },
      { msg: 'Keep going, you\'re doing well', type: 'info', at: 12 },
      { msg: 'Almost at minimum time', type: 'info', at: config.minSeconds - 5 },
    ];
    const tip = tips.find((t) => t.at === seconds);
    if (tip) {
      setFeedback({ message: tip.msg, type: tip.type, visible: true });
      setTimeout(() => setFeedback((f) => ({ ...f, visible: false })), 3000);
    }
  }, [seconds, state, config.minSeconds]);

  const handleStart = () => setState('recording');
  const handlePause = () => setState('paused');
  const handleResume = () => setState('recording');
  const handleStop = () => { setState('done'); navigate('/screen/processing'); };
  const handleRetry = () => { setSeconds(0); setState('idle'); };

  const isRecording = state === 'recording';
  const isPaused = state === 'paused';
  const meetsMin = seconds >= config.minSeconds;

  return (
    <>
      <div className="fixed inset-0 flex flex-col bg-background overflow-hidden">
        {/* ── HEADER ── */}
        <div className="relative z-20 flex items-center justify-between px-6 py-4">
          <button onClick={() => isRecording || isPaused ? setShowExit(true) : navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors cursor-pointer">
            <ArrowLeft size={16} /> Exit
          </button>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-deep-teal/8 text-deep-teal text-xs font-semibold">
            {config.icon} {config.label}
          </span>
          <span className="text-xs text-text-muted">Step 1 of {config.steps}</span>
        </div>

        {/* ── WAVEFORM AREA ── */}
        <div className="flex-1 relative flex items-center justify-center">
          {/* Mesh gradient background */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 45% 50%, rgba(10,124,124,0.04) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 30%, rgba(168,213,181,0.06) 0%, transparent 60%)' }} />

          {/* Volume meter */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
            <VolumeMeter active={isRecording} />
          </div>

          {/* Timer */}
          {(isRecording || isPaused || state === 'done') && (
            <div className="absolute top-6 right-6 z-10">
              <Timer seconds={seconds} minSeconds={config.minSeconds} />
            </div>
          )}

          {/* Waveform */}
          <WaveformVisualizer isRecording={isRecording} isPaused={isPaused} />

          {/* Start button (idle state) */}
          {state === 'idle' && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 flex flex-col items-center">
              <motion.button
                onClick={handleStart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-deep-teal to-deep-teal-light flex items-center justify-center text-white shadow-glow-lg cursor-pointer"
              >
                <Mic size={36} />
              </motion.button>
              <p className="mt-4 text-sm font-semibold text-navy-dark">Tap to Start Recording</p>
              <p className="text-xs text-text-muted mt-1">Min. {config.minSeconds}s required</p>
            </motion.div>
          )}

          {/* Prompt overlay */}
          {(isRecording || isPaused) && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute bottom-0 left-0 right-0 z-10 flex justify-center px-4 pb-28 md:pb-32"
            >
              <div className="glass rounded-2xl p-5 md:p-6 max-w-[600px] w-full">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-9 h-9 rounded-lg bg-deep-teal/10 flex items-center justify-center mt-0.5">
                    <Mic size={16} className="text-deep-teal" />
                  </div>
                  <p className="text-base md:text-lg font-medium text-navy-dark leading-relaxed">{config.prompt}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* ── PROGRESS BAR ── */}
        {(isRecording || isPaused) && (
          <div className="relative z-20 px-6">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={cn('h-full rounded-full', meetsMin ? 'bg-success' : 'bg-deep-teal')}
                animate={{ width: `${Math.min((seconds / config.minSeconds) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-text-muted text-center mt-1.5 font-medium">
              {meetsMin ? '✓ Ready to stop anytime' : `Keep going… ${config.minSeconds - seconds}s remaining`}
            </p>
          </div>
        )}

        {/* ── CONTROLS ── */}
        {(isRecording || isPaused) && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative z-20 flex justify-center py-6 md:py-8"
          >
            <div className="inline-flex items-center gap-4 bg-surface rounded-full px-6 py-3 shadow-xl border border-border/50">
              {/* Retry */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRetry}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border-[1.5px] border-border-strong flex items-center justify-center text-text-muted hover:text-text-primary hover:border-text-primary transition-colors cursor-pointer"
              >
                <RotateCcw size={20} />
              </motion.button>

              {/* Pause / Resume */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isPaused ? handleResume : handlePause}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-deep-teal to-deep-teal-light flex items-center justify-center text-white shadow-glow cursor-pointer"
              >
                {isPaused ? <Play size={24} className="ml-0.5" /> : <Pause size={24} />}
              </motion.button>

              {/* Stop */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleStop}
                disabled={!meetsMin}
                className={cn(
                  'w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-all cursor-pointer',
                  meetsMin
                    ? 'bg-coral text-white shadow-md hover:bg-coral-dark'
                    : 'bg-muted text-text-muted cursor-not-allowed',
                )}
              >
                <Square size={18} fill="currentColor" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <ExitModal open={showExit} onClose={() => setShowExit(false)} onConfirm={() => navigate('/screen/select')} />
      <FeedbackToast {...feedback} />
    </>
  );
}
