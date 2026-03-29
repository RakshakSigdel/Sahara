import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, AlertTriangle, Brain } from 'lucide-react';
import { useSession } from '../../contexts/SessionContext';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function SessionLayout({ children, patientName }) {
  const navigate = useNavigate();
  const { elapsedTime, currentQuestionIndex, totalQuestions, completedCount, isPaused, endSession } = useSession();
  const [exitModal, setExitModal] = useState(false);

  const progress = totalQuestions > 0 ? (completedCount / totalQuestions) * 100 : 0;

  const handleExit = () => {
    endSession();
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* ── Top Bar ── */}
      <header className="h-14 bg-surface/90 backdrop-blur-md border-b border-border/40 flex items-center justify-between px-4 lg:px-6 shrink-0 z-10">
        {/* Left: Patient */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-deep-teal to-sage flex items-center justify-center">
            <Brain size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary leading-tight">{patientName || 'Patient'}</p>
            <p className="text-[10px] text-text-muted">Active Session</p>
          </div>
        </div>

        {/* Center: Timer + Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-text-muted" />
            <span className="text-sm font-mono font-semibold text-text-primary">{formatTime(elapsedTime)}</span>
          </div>
          {isPaused && (
            <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-[10px] font-bold">PAUSED</span>
          )}
        </div>

        {/* Right: Exit */}
        <button onClick={() => setExitModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-text-muted hover:text-error hover:bg-error/5 transition-colors cursor-pointer">
          <X size={16} /> Exit
        </button>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* ── Bottom Progress ── */}
      <footer className="bg-surface/90 backdrop-blur-md border-t border-border/40 px-4 lg:px-6 py-3 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-text-muted">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-xs font-medium text-text-muted">
            {completedCount} completed
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div className="h-full bg-deep-teal rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
      </footer>

      {/* ── Exit Confirmation Modal ── */}
      <AnimatePresence>
        {exitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/40 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-surface rounded-xl shadow-xl border border-border/50 p-6 max-w-sm w-full">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} className="text-warning" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-navy-dark">End Session?</h3>
                  <p className="text-sm text-text-secondary mt-1">The session will be marked as interrupted. Recorded answers will be saved but no report will be generated.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setExitModal(false)} className="flex-1">Continue Session</Button>
                <Button variant="danger" onClick={handleExit} className="flex-1">End Session</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
