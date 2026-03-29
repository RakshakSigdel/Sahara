import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain } from 'lucide-react';

const statusMessages = [
  'Processing audio quality…',
  'Detecting speech patterns…',
  'Measuring pause durations…',
  'Analyzing word fluency…',
  'Calculating risk indicators…',
];

const funFacts = [
  'Voice patterns can reveal cognitive changes up to 10 years before symptoms appear.',
  'Your voice contains over 40 biomarkers linked to brain health.',
  'Subtle changes in speech rate are one of the earliest signs of cognitive decline.',
  'AI can detect pauses as short as 200ms that correlate with word-finding difficulty.',
  'Regular voice screening helps track your cognitive health trajectory over time.',
];

export default function ProcessingPage() {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(0);
  const navigate = useNavigate();

  // Progress bar
  useEffect(() => {
    const duration = 6000;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      setProgress(p * 100);
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(() => navigate('/screen/results'), 500);
    };
    requestAnimationFrame(tick);
  }, [navigate]);

  // Rotate status messages
  useEffect(() => {
    const id = setInterval(() => setMsgIndex((i) => (i + 1) % statusMessages.length), 2000);
    return () => clearInterval(id);
  }, []);

  // Rotate fun facts
  useEffect(() => {
    const id = setInterval(() => setFactIndex((i) => (i + 1) % funFacts.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background overflow-hidden">
      {/* Mesh background */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 45%, rgba(10,124,124,0.06) 0%, transparent 70%)' }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 flex flex-col items-center text-center px-6 max-w-[600px] w-full">

        {/* Pulsing rings animation */}
        <div className="relative w-[200px] h-[200px] mb-10">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-deep-teal/20"
              animate={{ scale: [1, 1.6 + i * 0.3], opacity: [0.4, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.6, ease: 'easeOut' }}
            />
          ))}
          {/* Center brain */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-deep-teal to-deep-teal-light flex items-center justify-center shadow-glow">
              <Brain size={36} className="text-white" />
            </div>
          </motion.div>
          {/* Orbiting dots */}
          {[0, 120, 240].map((angle, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-deep-teal/40"
              style={{ top: '50%', left: '50%' }}
              animate={{ rotate: [angle, angle + 360] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute w-3 h-3 rounded-full bg-deep-teal/40" style={{ transform: 'translate(-50%, -50%) translateX(80px)' }} />
            </motion.div>
          ))}
        </div>

        {/* Status text */}
        <h2 className="text-xl md:text-2xl font-bold text-navy-dark mb-3">Analyzing Your Voice Patterns…</h2>
        <div className="h-6 mb-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-text-secondary text-sm"
            >
              {statusMessages[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-[300px] mb-3">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-deep-teal to-sage"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <p className="text-xs text-text-muted mb-10">This usually takes 15–30 seconds</p>

        {/* Fun fact */}
        <div className="w-full max-w-[440px]">
          <div className="bg-surface rounded-xl border border-border/50 p-5 shadow-card">
            <p className="text-[10px] font-semibold text-deep-teal uppercase tracking-widest mb-2">Did You Know?</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={factIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-sm text-text-secondary leading-relaxed"
              >
                {funFacts[factIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
