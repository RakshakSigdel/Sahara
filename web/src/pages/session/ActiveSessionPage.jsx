import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Mic, Square, Play, Pause, RotateCcw, ArrowRight, ArrowLeft,
  AlertTriangle, Check, Clock, Brain, ChevronRight, Upload,
  FileAudio, MicOff, Keyboard, ChevronUp, Volume2
} from 'lucide-react';
import { useSession } from '../../contexts/SessionContext';
import { useDoctor } from '../../contexts/DoctorContext';
import useAudioRecorder from '../../hooks/useAudioRecorder';
import WaveformVisualizer from '../../components/shared/WaveformVisualizer';
import AudioUploader from '../../components/features/screening/AudioUploader';
import AudioPlayback from '../../components/features/screening/AudioPlayback';
import Button from '../../components/ui/Button';
import { cn } from '../../utils/cn';

function formatTime(s) {
  const m = Math.floor(s / 60);
  return `${m.toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
}

/* ─────────────────────────────────────────────
   ActiveSessionPage
   ───────────────────────────────────────────── */
export default function ActiveSessionPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { patients } = useDoctor();
  const {
    activeSession: currentSession,
    currentQuestionIndex,
    totalQuestions,
    completedCount,
    elapsedTime,
    goToQuestion,
    endSession,
    recordQuestion,
    analyzeRecording,
  } = useSession();

  // Audio recorder hook
  const recorder = useAudioRecorder();

  // Local state
  const [inputMode, setInputMode] = useState('record'); // 'record' | 'upload'
  const [recordingState, setRecordingState] = useState('ready'); // ready | recording | paused | complete
  const [uploadedFile, setUploadedFile] = useState(null); // { file, blob, url, name }
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [exitModal, setExitModal] = useState(false);
  const [endModal, setEndModal] = useState(false);
  const [switchWarning, setSwitchWarning] = useState(null); // target mode
  const [questionStatuses, setQuestionStatuses] = useState({});
  const [questionRecordings, setQuestionRecordings] = useState({}); // { index: { blob, url, type } }
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [micError, setMicError] = useState(null);

  const patient = patients.find((p) => p.id === currentSession?.patientId);
  const questions = currentSession?.questions || [];
  const currentQ = questions[currentQuestionIndex];

  // Sync recorder state
  useEffect(() => {
    if (recorder.isRecording && !recorder.isPaused) {
      setRecordingState('recording');
    } else if (recorder.isRecording && recorder.isPaused) {
      setRecordingState('paused');
    } else if (recorder.audioBlob && !recorder.isRecording) {
      setRecordingState('complete');
    }
  }, [recorder.isRecording, recorder.isPaused, recorder.audioBlob]);

  // Handle recorder errors
  useEffect(() => {
    if (recorder.error) {
      setMicError(recorder.error);
    }
  }, [recorder.error]);

  // ── Actions ──

  const startRecording = useCallback(async () => {
    setMicError(null);
    setAnalysisResult(null);
    setShowAnalysis(false);
    await recorder.startRecording();
  }, [recorder]);

  const stopRecording = useCallback(() => {
    recorder.stopRecording();
    setRecordingState('complete');
  }, [recorder]);

  const pauseRecording = useCallback(() => {
    recorder.pauseRecording();
    setRecordingState('paused');
  }, [recorder]);

  const resumeRecording = useCallback(() => {
    recorder.resumeRecording();
    setRecordingState('recording');
  }, [recorder]);

  const discardRecording = useCallback(() => {
    recorder.discardRecording();
    setRecordingState('ready');
    setAnalysisResult(null);
    setShowAnalysis(false);
  }, [recorder]);

  const handleFileSelected = useCallback((file, blob, url) => {
    setUploadedFile({ file, blob, url, name: file.name });
  }, []);

  const clearUpload = useCallback(() => {
    if (uploadedFile?.url) URL.revokeObjectURL(uploadedFile.url);
    setUploadedFile(null);
  }, [uploadedFile]);

  // Switch between record/upload modes
  const handleModeSwitch = useCallback((targetMode) => {
    const hasRecording = recordingState === 'recording' || recordingState === 'paused' || recordingState === 'complete';
    const hasUpload = !!uploadedFile;

    if ((hasRecording && targetMode === 'upload') || (hasUpload && targetMode === 'record')) {
      setSwitchWarning(targetMode);
    } else {
      setInputMode(targetMode);
    }
  }, [recordingState, uploadedFile]);

  const confirmModeSwitch = useCallback(() => {
    if (switchWarning === 'upload') {
      discardRecording();
    } else {
      clearUpload();
    }
    setInputMode(switchWarning);
    setSwitchWarning(null);
  }, [switchWarning, discardRecording, clearUpload]);

  // Save & Next
  const saveAndNext = useCallback(async () => {
    let blob, url, type;

    if (inputMode === 'record' && recorder.audioBlob) {
      blob = recorder.audioBlob;
      url = recorder.audioURL;
      type = 'recorded';
    } else if (inputMode === 'upload' && uploadedFile) {
      blob = uploadedFile.blob;
      url = uploadedFile.url;
      type = 'uploaded';
    } else {
      return;
    }

    // Save recording to local state
    setQuestionRecordings((prev) => ({
      ...prev,
      [currentQuestionIndex]: { blob, url, type },
    }));

    // Record in session context
    if (currentQ?.id) {
      recordQuestion(currentQ.id, blob);
    }

    // Mock analysis
    setAnalyzing(true);
    try {
      let analysis;
      if (currentQ?.id) {
        analysis = await analyzeRecording(currentQ.id);
      } else {
        await new Promise((r) => setTimeout(r, 1500));
        analysis = {
          speechRate: 110 + Math.floor(Math.random() * 50),
          pauseDuration: +(0.8 + Math.random() * 3).toFixed(1),
          coherence: ['Good', 'Fair', 'Excellent'][Math.floor(Math.random() * 3)],
        };
      }
      setAnalysisResult(analysis);
      setShowAnalysis(true);
    } catch {
      // Queue for later upload, allow offline recording
      setAnalysisResult({ offline: true });
      setShowAnalysis(true);
    }
    setAnalyzing(false);

    setQuestionStatuses((p) => ({ ...p, [currentQuestionIndex]: 'completed' }));

    // Auto-advance after brief delay
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        goToQuestion(currentQuestionIndex + 1);
        resetForNewQuestion();
      } else {
        setEndModal(true);
      }
    }, 1200);
  }, [
    inputMode, recorder.audioBlob, recorder.audioURL, uploadedFile,
    currentQuestionIndex, currentQ, totalQuestions,
    recordQuestion, analyzeRecording, goToQuestion,
  ]);

  const resetForNewQuestion = useCallback(() => {
    recorder.discardRecording();
    setRecordingState('ready');
    clearUpload();
    setInputMode('record');
    setAnalysisResult(null);
    setShowAnalysis(false);
    setAnalyzing(false);
    setMicError(null);
  }, [recorder, clearUpload]);

  // Navigation
  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      resetForNewQuestion();
      goToQuestion(currentQuestionIndex - 1);
      // Restore state if previously completed
      if (questionStatuses[currentQuestionIndex - 1] === 'completed') {
        setRecordingState('complete');
      }
    }
  }, [currentQuestionIndex, goToQuestion, questionStatuses, resetForNewQuestion]);

  const goToNextQuestion = useCallback(() => {
    if (questionStatuses[currentQuestionIndex] === 'completed' && currentQuestionIndex < totalQuestions - 1) {
      resetForNewQuestion();
      goToQuestion(currentQuestionIndex + 1);
      if (questionStatuses[currentQuestionIndex + 1] === 'completed') {
        setRecordingState('complete');
      }
    }
  }, [currentQuestionIndex, questionStatuses, totalQuestions, goToQuestion, resetForNewQuestion]);

  const jumpToQuestion = useCallback((index) => {
    if (index === currentQuestionIndex) return;
    if (questionStatuses[index] === 'completed' || index === currentQuestionIndex) {
      resetForNewQuestion();
      goToQuestion(index);
      if (questionStatuses[index] === 'completed') {
        setRecordingState('complete');
      }
    }
  }, [currentQuestionIndex, questionStatuses, goToQuestion, resetForNewQuestion]);

  const handleExit = () => { endSession(); navigate('/dashboard'); };
  const handleGenerateReport = () => { endSession(); navigate(`/session/report/${sessionId}`); };

  // ── Keyboard Shortcuts ──
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (recordingState === 'ready' && inputMode === 'record') {
            startRecording();
          } else if (recordingState === 'recording') {
            stopRecording();
          }
          break;
        case 'p':
        case 'P':
          if (recordingState === 'recording') pauseRecording();
          break;
        case 'r':
        case 'R':
          if (recordingState === 'paused') resumeRecording();
          break;
        case 'ArrowRight':
          goToNextQuestion();
          break;
        case 'ArrowLeft':
          goToPreviousQuestion();
          break;
        case 'Escape':
          setExitModal(true);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [recordingState, inputMode, startRecording, stopRecording, pauseRecording, resumeRecording, goToNextQuestion, goToPreviousQuestion]);

  // ── No session guard ──
  if (!currentSession) {
    return (
      <div className="flex flex-col h-screen bg-background items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-deep-teal/10 flex items-center justify-center mx-auto mb-4">
            <Brain size={28} className="text-deep-teal" />
          </div>
          <p className="text-text-muted mb-4">No active session found.</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const hasCurrentAudio = (inputMode === 'record' && recordingState === 'complete' && recorder.audioURL) ||
                          (inputMode === 'upload' && uploadedFile);

  return (
    <div className="flex flex-col h-screen bg-background">

      {/* ═══════════ TOP BAR ═══════════ */}
      <header className="h-14 bg-surface/90 backdrop-blur-md border-b border-border/40 flex items-center justify-between px-4 lg:px-6 shrink-0 z-20">
        <button
          onClick={() => setExitModal(true)}
          className="flex items-center gap-1.5 text-sm text-text-muted hover:text-error transition-colors cursor-pointer"
        >
          <X size={16} /> <span className="hidden sm:inline">Exit</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-deep-teal/10 flex items-center justify-center text-deep-teal text-[10px] font-bold">
            {patient?.fullName?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <span className="text-sm font-medium text-text-primary hidden sm:inline">{patient?.fullName}</span>
          <span className="text-xs text-text-muted">•</span>
          <span className="text-sm font-mono font-semibold text-text-primary flex items-center gap-1">
            <Clock size={13} />{formatTime(elapsedTime)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="p-1.5 text-text-muted hover:text-text-primary transition-colors cursor-pointer hidden sm:flex"
            title="Keyboard shortcuts"
          >
            <Keyboard size={15} />
          </button>
          {/* Mobile nav trigger */}
          <button
            onClick={() => setShowMobileNav(true)}
            className="lg:hidden p-1.5 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            <ChevronUp size={16} />
          </button>
        </div>
      </header>

      {/* Shortcuts tooltip */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-14 right-4 z-30 bg-surface rounded-xl border border-border/60 shadow-lg p-4 w-64"
          >
            <p className="text-xs font-bold text-text-muted uppercase mb-2">Keyboard Shortcuts</p>
            <div className="space-y-1.5 text-xs">
              {[
                ['Space', 'Start / Stop recording'],
                ['P', 'Pause recording'],
                ['R', 'Resume recording'],
                ['→', 'Next question'],
                ['←', 'Previous question'],
                ['Esc', 'Exit session'],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center justify-between gap-2">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono font-bold text-text-secondary">{key}</kbd>
                  <span className="text-text-muted">{desc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex overflow-hidden">
        {/* ═══════════ MAIN CONTENT ═══════════ */}
        <main className="flex-1 flex flex-col items-center justify-between px-4 py-5 overflow-y-auto">

          {/* ── Progress Bar ── */}
          <div className="w-full max-w-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-text-muted">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className="text-xs text-text-muted">{completedCount} completed</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-deep-teal to-sage rounded-full"
                animate={{ width: `${((completedCount) / totalQuestions) * 100}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* ── Question Card ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-xl my-5"
            >
              <div className="bg-surface rounded-2xl border border-border/60 shadow-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="w-8 h-8 rounded-full bg-deep-teal/10 flex items-center justify-center text-deep-teal text-xs font-bold">
                    #{currentQuestionIndex + 1}
                  </span>
                  <span className="text-[10px] font-bold text-deep-teal bg-deep-teal/8 px-2 py-0.5 rounded-full uppercase">
                    {currentQ?.category || 'General'}
                  </span>
                </div>
                <p className="text-lg md:text-xl font-semibold text-navy-dark leading-relaxed">
                  {currentQ?.questionText || 'Loading question…'}
                </p>
                <p className="text-xs text-text-muted mt-3">~{currentQ?.expectedDuration || 60}s expected</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── Input Mode Tabs ── */}
          <div className="w-full max-w-xl">
            <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl mb-4 w-fit mx-auto">
              <button
                onClick={() => handleModeSwitch('record')}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                  inputMode === 'record'
                    ? 'bg-surface text-deep-teal shadow-sm'
                    : 'text-text-muted hover:text-text-secondary'
                )}
              >
                <Mic size={13} /> Record Live
              </button>
              <button
                onClick={() => handleModeSwitch('upload')}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                  inputMode === 'upload'
                    ? 'bg-surface text-deep-teal shadow-sm'
                    : 'text-text-muted hover:text-text-secondary'
                )}
              >
                <Upload size={13} /> Upload Audio
              </button>
            </div>

            {/* ── RECORD MODE ── */}
            {inputMode === 'record' && (
              <div className="flex flex-col items-center gap-4">

                {/* Microphone Error */}
                <AnimatePresence>
                  {micError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="w-full bg-error/5 border border-error/15 rounded-xl p-4 flex items-start gap-3"
                    >
                      <MicOff size={18} className="text-error shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-error">Microphone Access Required</p>
                        <p className="text-xs text-text-muted mt-1">{micError}</p>
                        <p className="text-xs text-text-muted mt-2">
                          <strong>Chrome:</strong> Click the lock icon in the address bar → Site settings → Microphone → Allow
                        </p>
                      </div>
                      <button onClick={() => setMicError(null)} className="text-error/50 hover:text-error cursor-pointer p-1">
                        <X size={14} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Waveform */}
                <WaveformVisualizer
                  waveformData={recorder.waveformData}
                  isRecording={recordingState === 'recording'}
                  isPaused={recordingState === 'paused'}
                  isFrozen={recordingState === 'complete'}
                  height={window.innerWidth < 640 ? 100 : 140}
                  className="w-full"
                />

                {/* Ready State */}
                {recordingState === 'ready' && (
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-3">
                    <button
                      onClick={startRecording}
                      className="w-20 h-20 min-h-[48px] rounded-full bg-gradient-to-br from-deep-teal to-deep-teal-dark flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      aria-label="Start recording"
                    >
                      <Mic size={28} />
                    </button>
                    <p className="text-sm text-text-muted">
                      Tap to start recording
                      <kbd className="ml-2 px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Space</kbd>
                    </p>
                  </motion.div>
                )}

                {/* Recording State */}
                {recordingState === 'recording' && (
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-3">
                    {/* Live indicator */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-coral" />
                      </span>
                      <span className="text-xs font-bold text-coral uppercase">Recording</span>
                    </div>

                    <p className="text-2xl font-mono font-bold text-navy-dark tabular-nums">{recorder.formattedTime}</p>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={discardRecording}
                        className="p-3 min-w-[48px] min-h-[48px] rounded-full bg-muted/50 text-text-muted hover:text-error hover:bg-error/5 transition-colors cursor-pointer"
                        aria-label="Discard"
                      >
                        <X size={20} />
                      </button>
                      <button
                        onClick={stopRecording}
                        className="w-20 h-20 min-h-[48px] rounded-full bg-gradient-to-br from-coral to-error flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        aria-label="Stop recording"
                      >
                        <Square size={24} />
                      </button>
                      <button
                        onClick={pauseRecording}
                        className="p-3 min-w-[48px] min-h-[48px] rounded-full bg-muted/50 text-text-muted hover:text-warning hover:bg-warning/5 transition-colors cursor-pointer"
                        aria-label="Pause"
                      >
                        <Pause size={20} />
                      </button>
                    </div>

                    <p className="text-xs text-text-muted">
                      Press <kbd className="px-1 py-0.5 bg-muted rounded text-[10px] font-mono">Space</kbd> to stop
                      • <kbd className="px-1 py-0.5 bg-muted rounded text-[10px] font-mono">P</kbd> to pause
                    </p>
                  </motion.div>
                )}

                {/* Paused State */}
                {recordingState === 'paused' && (
                  <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-warning/10 border border-warning/20">
                      <Pause size={12} className="text-warning" />
                      <span className="text-xs font-bold text-warning">PAUSED</span>
                      <span className="text-xs font-mono font-bold text-warning">{recorder.formattedTime}</span>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={discardRecording} leftIcon={<X size={14} />}>
                        Discard
                      </Button>
                      <Button onClick={resumeRecording} leftIcon={<Play size={14} />}>
                        Resume
                      </Button>
                    </div>
                    <p className="text-xs text-text-muted">
                      Press <kbd className="px-1 py-0.5 bg-muted rounded text-[10px] font-mono">R</kbd> to resume
                    </p>
                  </motion.div>
                )}

                {/* Complete State — Playback */}
                {recordingState === 'complete' && !analyzing && recorder.audioURL && (
                  <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4 w-full">
                    <AudioPlayback
                      audioURL={recorder.audioURL}
                      duration={recorder.recordingTime}
                      className="w-full"
                    />
                    <div className="flex gap-3 w-full max-w-xs">
                      <Button variant="outline" className="flex-1" leftIcon={<RotateCcw size={14} />} onClick={discardRecording}>
                        Re-record
                      </Button>
                      <Button className="flex-1" rightIcon={<ArrowRight size={14} />} onClick={saveAndNext}>
                        Save & Next
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* ── UPLOAD MODE ── */}
            {inputMode === 'upload' && (
              <div className="flex flex-col items-center gap-4">
                {!uploadedFile ? (
                  <AudioUploader
                    onFileSelected={handleFileSelected}
                    onError={(msg) => setMicError(msg)}
                    className="w-full"
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex flex-col gap-4"
                  >
                    {/* File info card */}
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/40">
                      <div className="w-10 h-10 rounded-xl bg-deep-teal/10 flex items-center justify-center shrink-0">
                        <FileAudio size={18} className="text-deep-teal" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{uploadedFile.name}</p>
                        <p className="text-[11px] text-text-muted">
                          {(uploadedFile.file.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      </div>
                      <button
                        onClick={clearUpload}
                        className="p-1.5 text-text-muted hover:text-error transition-colors cursor-pointer"
                        aria-label="Remove"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* Playback preview */}
                    <AudioPlayback audioURL={uploadedFile.url} fileName={uploadedFile.name} className="w-full" />

                    {/* Actions */}
                    <div className="flex gap-3 w-full max-w-xs mx-auto">
                      <Button variant="outline" className="flex-1" onClick={clearUpload} leftIcon={<X size={14} />}>
                        Remove
                      </Button>
                      <Button className="flex-1" rightIcon={<ArrowRight size={14} />} onClick={saveAndNext}>
                        Save & Next
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* ── Analyzing Spinner ── */}
            {analyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-3 mt-4"
              >
                <div className="w-10 h-10 border-2 border-deep-teal/30 border-t-deep-teal rounded-full animate-spin" />
                <p className="text-sm text-text-muted">Analyzing response…</p>
              </motion.div>
            )}

            {/* ── Quick Analysis Badge ── */}
            <AnimatePresence>
              {showAnalysis && analysisResult && !analysisResult.offline && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-success/5 border border-success/15 mt-4"
                >
                  <Check size={14} className="text-success shrink-0" />
                  <span className="text-xs text-text-secondary">
                    {analysisResult.speechRate} wpm • {analysisResult.pauseDuration}s pauses • Coherence: {analysisResult.coherenceScore || analysisResult.coherence}
                  </span>
                </motion.div>
              )}
              {showAnalysis && analysisResult?.offline && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-warning/5 border border-warning/15 mt-4"
                >
                  <AlertTriangle size={14} className="text-warning shrink-0" />
                  <span className="text-xs text-text-secondary">Saved offline. Analysis will run when connected.</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Question Navigation Arrows ── */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                  currentQuestionIndex > 0
                    ? 'text-text-secondary hover:text-text-primary hover:bg-muted/50'
                    : 'text-text-muted/30 cursor-not-allowed'
                )}
              >
                <ArrowLeft size={14} /> Previous
              </button>
              <button
                onClick={goToNextQuestion}
                disabled={!(questionStatuses[currentQuestionIndex] === 'completed' && currentQuestionIndex < totalQuestions - 1)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                  questionStatuses[currentQuestionIndex] === 'completed' && currentQuestionIndex < totalQuestions - 1
                    ? 'text-text-secondary hover:text-text-primary hover:bg-muted/50'
                    : 'text-text-muted/30 cursor-not-allowed'
                )}
              >
                Next <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </main>

        {/* ═══════════ SIDEBAR — Question Navigator (Desktop) ═══════════ */}
        <aside className="hidden lg:block w-60 bg-surface border-l border-border/40 overflow-y-auto p-3 shrink-0">
          <p className="text-[10px] font-bold text-text-muted uppercase mb-3 px-1">Questions</p>
          <div className="space-y-1">
            {questions.map((q, i) => {
              const status = questionStatuses[i] || (i === currentQuestionIndex ? 'current' : 'pending');
              const canClick = status === 'completed' || i === currentQuestionIndex;
              return (
                <button
                  key={i}
                  onClick={() => canClick && jumpToQuestion(i)}
                  disabled={!canClick}
                  className={cn(
                    'w-full flex items-center gap-2 px-2.5 py-2.5 rounded-xl text-left transition-all text-xs min-h-[44px]',
                    i === currentQuestionIndex
                      ? 'bg-deep-teal/8 text-deep-teal border border-deep-teal/15'
                      : status === 'completed'
                        ? 'text-text-secondary hover:bg-muted/30 cursor-pointer'
                        : 'text-text-muted/50 cursor-not-allowed',
                    canClick && 'cursor-pointer'
                  )}
                >
                  {/* Status icon */}
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold',
                    status === 'completed'
                      ? 'bg-success/15 text-success'
                      : i === currentQuestionIndex
                        ? 'bg-deep-teal/15 text-deep-teal'
                        : 'bg-muted text-text-muted'
                  )}>
                    {status === 'completed' ? (
                      <Check size={11} />
                    ) : i === currentQuestionIndex && recordingState === 'recording' ? (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-deep-teal opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-deep-teal" />
                      </span>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className="truncate flex-1">{q.questionText?.slice(0, 35)}…</span>
                  {status === 'completed' && questionRecordings[i] && (
                    <span className="text-[9px] text-text-muted shrink-0">
                      {questionRecordings[i].type === 'uploaded' ? '📎' : '🎤'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>
      </div>

      {/* ═══════════ MOBILE BOTTOM DRAWER — Question Navigator ═══════════ */}
      <AnimatePresence>
        {showMobileNav && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileNav(false)}
              className="fixed inset-0 bg-navy-dark/30 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-2xl border-t border-border/40 shadow-xl max-h-[70vh] overflow-y-auto lg:hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-navy-dark">Questions</p>
                  <button
                    onClick={() => setShowMobileNav(false)}
                    className="p-1.5 text-text-muted hover:text-text-primary cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />
                <div className="space-y-1.5">
                  {questions.map((q, i) => {
                    const status = questionStatuses[i] || (i === currentQuestionIndex ? 'current' : 'pending');
                    const canClick = status === 'completed' || i === currentQuestionIndex;
                    return (
                      <button
                        key={i}
                        onClick={() => { if (canClick) { jumpToQuestion(i); setShowMobileNav(false); } }}
                        disabled={!canClick}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left min-h-[48px] transition-all',
                          i === currentQuestionIndex
                            ? 'bg-deep-teal/8 text-deep-teal border border-deep-teal/15'
                            : status === 'completed'
                              ? 'text-text-secondary hover:bg-muted/30'
                              : 'text-text-muted/50',
                          canClick && 'cursor-pointer'
                        )}
                      >
                        <div className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold',
                          status === 'completed'
                            ? 'bg-success/15 text-success'
                            : i === currentQuestionIndex
                              ? 'bg-deep-teal/15 text-deep-teal'
                              : 'bg-muted text-text-muted'
                        )}>
                          {status === 'completed' ? <Check size={12} /> : i + 1}
                        </div>
                        <span className="text-sm truncate flex-1">{q.questionText?.slice(0, 40)}…</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════ SWITCH MODE WARNING MODAL ═══════════ */}
      <AnimatePresence>
        {switchWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/40 backdrop-blur-sm px-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-xl shadow-xl border border-border/50 p-6 max-w-sm w-full"
            >
              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} className="text-warning" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-navy-dark">Switch Input Mode?</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    {switchWarning === 'upload'
                      ? 'Current recording will be discarded.'
                      : 'Uploaded file will be removed.'}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setSwitchWarning(null)}>Cancel</Button>
                <Button variant="danger" className="flex-1" onClick={confirmModeSwitch}>Switch</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════ EXIT MODAL ═══════════ */}
      <AnimatePresence>
        {exitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/40 backdrop-blur-sm px-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-xl shadow-xl border border-border/50 p-6 max-w-sm w-full"
            >
              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} className="text-warning" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-navy-dark">Pause Session?</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    All recordings will be saved. Progress: {completedCount}/{totalQuestions} completed.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setExitModal(false)}>Continue</Button>
                <Button variant="danger" className="flex-1" onClick={handleExit}>Save & Exit</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════ SESSION COMPLETE MODAL ═══════════ */}
      <AnimatePresence>
        {endModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/40 backdrop-blur-sm px-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-xl shadow-xl border border-border/50 p-6 max-w-sm w-full text-center"
            >
              {/* Animated success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.3 }}
                >
                  <Check size={28} className="text-success" />
                </motion.div>
              </motion.div>

              <h3 className="text-lg font-bold text-navy-dark">Session Complete! 🎉</h3>
              <p className="text-sm text-text-secondary mt-2">
                All {totalQuestions} questions answered
              </p>
              <p className="text-xs text-text-muted mt-1 mb-6">
                Total session time: {formatTime(elapsedTime)}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="bg-muted/30 rounded-lg p-2.5">
                  <p className="text-lg font-bold text-navy-dark">{totalQuestions}</p>
                  <p className="text-[10px] text-text-muted">Questions</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-2.5">
                  <p className="text-lg font-bold text-navy-dark">{formatTime(elapsedTime)}</p>
                  <p className="text-[10px] text-text-muted">Duration</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-2.5">
                  <p className="text-lg font-bold text-deep-teal">
                    {Object.values(questionRecordings).filter((r) => r.type === 'recorded').length}🎤
                    {Object.values(questionRecordings).filter((r) => r.type === 'uploaded').length > 0 &&
                      ` ${Object.values(questionRecordings).filter((r) => r.type === 'uploaded').length}📎`
                    }
                  </p>
                  <p className="text-[10px] text-text-muted">Recordings</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => navigate(`/session/review/${sessionId}`)}>
                  Review Session
                </Button>
                <Button className="flex-1" onClick={handleGenerateReport}>
                  Generate Report
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
