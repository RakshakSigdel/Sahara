import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Square, Play, Pause, RotateCcw, ArrowRight, AlertTriangle, Check, Clock, Brain, ChevronRight } from 'lucide-react';
import { useSession } from '../../contexts/SessionContext';
import { useDoctor } from '../../contexts/DoctorContext';
import Button from '../../components/ui/Button';
import { cn } from '../../utils/cn';

function formatTime(s) { const m = Math.floor(s / 60); return `${m.toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`; }

/* ── Waveform Bars ── */
function WaveformBars({ active, frozen }) {
  const [bars, setBars] = useState(Array(50).fill(0.15));
  useEffect(() => {
    if (!active && !frozen) { setBars(Array(50).fill(0.15)); return; }
    if (frozen) return;
    const iv = setInterval(() => setBars(Array(50).fill(0).map(() => 0.1 + Math.random() * 0.9)), 100);
    return () => clearInterval(iv);
  }, [active, frozen]);
  return (
    <div className="flex items-center justify-center gap-[3px] h-32 md:h-44">
      {bars.map((h, i) => (
        <motion.div key={i} className="w-[4px] md:w-[5px] rounded-full" style={{ background: `linear-gradient(to top, #0A7C7C, #A8D5B5)`, opacity: active || frozen ? 0.85 : 0.25 }}
          animate={{ height: `${h * (frozen ? 0.6 : 1) * 100}%` }} transition={{ duration: 0.08 }} />
      ))}
    </div>
  );
}

export default function ActiveSessionPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { patients } = useDoctor();
  const { currentSession, currentQuestionIndex, totalQuestions, completedCount, elapsedTime, goToQuestion, endSession } = useSession();

  const [recordingState, setRecordingState] = useState('ready'); // ready | recording | paused | complete
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingBack, setPlayingBack] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [exitModal, setExitModal] = useState(false);
  const [endModal, setEndModal] = useState(false);
  const [questionStatuses, setQuestionStatuses] = useState({});

  const patient = patients.find((p) => p.id === currentSession?.patientId);
  const questions = currentSession?.questions || [];
  const currentQ = questions[currentQuestionIndex];

  // Recording timer
  useEffect(() => {
    if (recordingState !== 'recording') return;
    const iv = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    return () => clearInterval(iv);
  }, [recordingState]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
      if (e.key === 'r' || e.key === 'R') { if (recordingState === 'ready') startRecording(); }
      if (e.key === 's' || e.key === 'S') { if (recordingState === 'recording') stopRecording(); }
      if (e.key === ' ') { e.preventDefault(); if (recordingState === 'complete') setPlayingBack((p) => !p); }
      if (e.key === 'Escape') setExitModal(true);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [recordingState]);

  const startRecording = () => { setRecordingState('recording'); setRecordingTime(0); setAnalysisResult(null); setShowAnalysis(false); };
  const stopRecording = () => setRecordingState('complete');
  const discardRecording = () => { setRecordingState('ready'); setRecordingTime(0); };

  const analyzeAndNext = async () => {
    setAnalyzing(true);
    await new Promise((r) => setTimeout(r, 2000));
    const result = { speechRate: 110 + Math.floor(Math.random() * 50), pauseDuration: +(0.8 + Math.random() * 3).toFixed(1), coherence: ['Good', 'Fair', 'Excellent'][Math.floor(Math.random() * 3)] };
    setAnalysisResult(result);
    setShowAnalysis(true);
    setAnalyzing(false);
    setQuestionStatuses((p) => ({ ...p, [currentQuestionIndex]: 'completed' }));

    // Auto-advance after delay
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        goToQuestion(currentQuestionIndex + 1);
        setRecordingState('ready');
        setRecordingTime(0);
        setShowAnalysis(false);
        setAnalysisResult(null);
      } else {
        setEndModal(true);
      }
    }, 1500);
  };

  const handleExit = () => { endSession(); navigate('/dashboard'); };
  const handleGenerateReport = () => { endSession(); navigate(`/session/report/${sessionId}`); };

  if (!currentSession) {
    return (
      <div className="flex flex-col h-screen bg-background items-center justify-center">
        <p className="text-text-muted mb-4">No active session found.</p>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* ── Top Bar ── */}
      <header className="h-14 bg-surface/90 backdrop-blur-md border-b border-border/40 flex items-center justify-between px-4 lg:px-6 shrink-0 z-10">
        <button onClick={() => setExitModal(true)} className="flex items-center gap-1.5 text-sm text-text-muted hover:text-error transition-colors cursor-pointer"><X size={16} /> Exit</button>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-deep-teal/10 flex items-center justify-center text-deep-teal text-[10px] font-bold">{patient?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
          <span className="text-sm font-medium text-text-primary hidden sm:inline">{patient?.fullName}</span>
          <span className="text-xs text-text-muted">•</span>
          <span className="text-sm font-mono font-semibold text-text-primary flex items-center gap-1"><Clock size={13} />{formatTime(elapsedTime)}</span>
        </div>
        <div className="w-16" />
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* ── Main Content ── */}
        <main className="flex-1 flex flex-col items-center justify-between px-4 py-6 overflow-y-auto">
          {/* Progress */}
          <div className="w-full max-w-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-text-muted">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
              <span className="text-xs text-text-muted">{completedCount} completed</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-deep-teal to-sage rounded-full" animate={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }} transition={{ duration: 0.3 }} />
            </div>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div key={currentQuestionIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="w-full max-w-xl my-6">
              <div className="bg-surface rounded-2xl border border-border/60 shadow-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="w-8 h-8 rounded-full bg-deep-teal/10 flex items-center justify-center text-deep-teal text-xs font-bold">#{currentQuestionIndex + 1}</span>
                  <span className="text-[10px] font-bold text-deep-teal bg-deep-teal/8 px-2 py-0.5 rounded-full uppercase">{currentQ?.category || 'General'}</span>
                </div>
                <p className="text-lg md:text-xl font-semibold text-navy-dark leading-relaxed">{currentQ?.questionText || 'Loading question…'}</p>
                <p className="text-xs text-text-muted mt-3">~{currentQ?.expectedDuration || 60}s expected</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Waveform */}
          <div className="w-full max-w-xl">
            <WaveformBars active={recordingState === 'recording'} frozen={recordingState === 'complete'} />
          </div>

          {/* Controls */}
          <div className="w-full max-w-xl mt-6 flex flex-col items-center gap-3">
            {recordingState === 'ready' && (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-3">
                <button onClick={startRecording} className="w-20 h-20 rounded-full bg-gradient-to-br from-deep-teal to-deep-teal-dark flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
                  <Mic size={28} />
                </button>
                <p className="text-sm text-text-muted">Tap to start recording <span className="text-[10px] text-text-muted ml-1">(R)</span></p>
              </motion.div>
            )}

            {recordingState === 'recording' && (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-3">
                <p className="text-lg font-mono font-bold text-navy-dark">{formatTime(recordingTime)}</p>
                <div className="flex items-center gap-4">
                  <button onClick={discardRecording} className="p-3 rounded-full bg-muted/50 text-text-muted hover:text-error hover:bg-error/5 transition-colors cursor-pointer"><X size={20} /></button>
                  <button onClick={stopRecording} className="w-20 h-20 rounded-full bg-gradient-to-br from-coral to-error flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer animate-pulse">
                    <Square size={24} />
                  </button>
                  <button onClick={() => setRecordingState('paused')} className="p-3 rounded-full bg-muted/50 text-text-muted hover:text-warning hover:bg-warning/5 transition-colors cursor-pointer"><Pause size={20} /></button>
                </div>
                <p className="text-xs text-text-muted">Recording… Press S to stop</p>
              </motion.div>
            )}

            {recordingState === 'paused' && (
              <div className="flex flex-col items-center gap-3">
                <span className="text-xs font-bold text-warning bg-warning/10 px-3 py-1 rounded-full">PAUSED — {formatTime(recordingTime)}</span>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={discardRecording}>Discard</Button>
                  <Button onClick={() => setRecordingState('recording')}>Resume</Button>
                </div>
              </div>
            )}

            {recordingState === 'complete' && !analyzing && (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4 w-full">
                <div className="flex items-center gap-3">
                  <button onClick={() => setPlayingBack(!playingBack)} className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center text-deep-teal hover:bg-muted transition-colors cursor-pointer">
                    {playingBack ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <span className="text-sm font-mono text-text-muted">{formatTime(recordingTime)}</span>
                </div>
                <div className="flex gap-3 w-full max-w-xs">
                  <Button variant="outline" className="flex-1" leftIcon={<RotateCcw size={14} />} onClick={discardRecording}>Re-record</Button>
                  <Button className="flex-1" rightIcon={<ArrowRight size={14} />} onClick={analyzeAndNext}>Analyze & Next</Button>
                </div>
              </motion.div>
            )}

            {analyzing && (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-deep-teal/30 border-t-deep-teal rounded-full animate-spin" />
                <p className="text-sm text-text-muted">Analyzing response…</p>
              </div>
            )}

            {/* Quick analysis */}
            <AnimatePresence>
              {showAnalysis && analysisResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-4 px-4 py-2.5 rounded-lg bg-success/5 border border-success/15">
                  <Check size={14} className="text-success" />
                  <span className="text-xs text-text-secondary">{analysisResult.speechRate} wpm • {analysisResult.pauseDuration}s pauses • {analysisResult.coherence}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* ── Question Navigator (side panel) ── */}
        <aside className="hidden lg:block w-56 bg-surface border-l border-border/40 overflow-y-auto p-3">
          <p className="text-[10px] font-bold text-text-muted uppercase mb-3 px-1">Questions</p>
          <div className="space-y-1">
            {questions.map((q, i) => {
              const status = questionStatuses[i] || (i === currentQuestionIndex ? 'current' : 'pending');
              return (
                <button key={i} onClick={() => { if (status === 'completed' || status === 'current') { goToQuestion(i); setRecordingState(status === 'completed' ? 'complete' : 'ready'); } }}
                  className={cn('w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-colors cursor-pointer text-xs',
                    status === 'current' ? 'bg-deep-teal/8 text-deep-teal' : status === 'completed' ? 'text-text-secondary hover:bg-muted/30' : 'text-text-muted'
                  )}>
                  <div className={cn('w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold',
                    status === 'completed' ? 'bg-success/15 text-success' : status === 'current' ? 'bg-deep-teal/15 text-deep-teal' : 'bg-muted text-text-muted'
                  )}>
                    {status === 'completed' ? <Check size={10} /> : i + 1}
                  </div>
                  <span className="truncate">{q.questionText?.slice(0, 30)}…</span>
                </button>
              );
            })}
          </div>
        </aside>
      </div>

      {/* ── Exit Modal ── */}
      <AnimatePresence>
        {exitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/40 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-surface rounded-xl shadow-xl border border-border/50 p-6 max-w-sm w-full">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0"><AlertTriangle size={20} className="text-warning" /></div>
                <div><h3 className="text-base font-bold text-navy-dark">Pause Session?</h3><p className="text-sm text-text-secondary mt-1">All recordings will be saved. Progress: {completedCount}/{totalQuestions} completed.</p></div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setExitModal(false)}>Continue</Button>
                <Button variant="danger" className="flex-1" onClick={handleExit}>Save & Exit</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── End Session Modal ── */}
      <AnimatePresence>
        {endModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/40 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-surface rounded-xl shadow-xl border border-border/50 p-6 max-w-sm w-full text-center">
              <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4"><Check size={24} className="text-success" /></div>
              <h3 className="text-lg font-bold text-navy-dark">All Questions Completed!</h3>
              <p className="text-sm text-text-secondary mt-2 mb-6">Total time: {formatTime(elapsedTime)} • {totalQuestions} questions</p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => navigate(`/session/review/${sessionId}`)}>Review Recordings</Button>
                <Button className="flex-1" onClick={handleGenerateReport}>Generate Report</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
