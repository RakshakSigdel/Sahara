import { createContext, useContext, useState, useCallback, useRef } from 'react';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [activeSession, setActiveSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordings, setRecordings] = useState({});         // { questionId: blob }
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);

  /* ── Session lifecycle ── */
  const startSession = useCallback((sessionDataOrPatientId, questions) => {
    let sessionData;
    if (typeof sessionDataOrPatientId === 'string' && Array.isArray(questions)) {
      // Called as startSession(patientId, questions) from SessionSetupPage
      sessionData = {
        id: `ses_${Date.now()}`,
        patientId: sessionDataOrPatientId,
        questions: questions.map((q, i) => ({
          id: q.id || `sq_${Date.now()}_${i}`,
          questionText: q.questionText || '',
          category: q.category || 'General',
          expectedDuration: q.expectedDuration || 60,
          order: i + 1,
          status: 'pending',
          analysis: null,
          audioRecordingUrl: null,
          recordedAt: null,
        })),
        status: 'in-progress',
        sessionDate: new Date().toISOString(),
      };
    } else {
      sessionData = sessionDataOrPatientId;
    }
    setActiveSession(sessionData);
    setCurrentQuestionIndex(0);
    setRecordings({});
    setIsRecording(false);
    setIsPaused(false);
    setElapsedTime(0);
    // Start session timer
    timerRef.current = setInterval(() => setElapsedTime((t) => t + 1), 1000);
    return sessionData;
  }, []);

  const pauseSession = useCallback(() => {
    setIsPaused(true);
    setIsRecording(false);
    clearInterval(timerRef.current);
  }, []);

  const resumeSession = useCallback(() => {
    setIsPaused(false);
    timerRef.current = setInterval(() => setElapsedTime((t) => t + 1), 1000);
  }, []);

  const endSession = useCallback(() => {
    clearInterval(timerRef.current);
    setIsRecording(false);
    setIsPaused(false);
    const session = activeSession;
    setActiveSession(null);
    return session;
  }, [activeSession]);

  /* ── Recording ── */
  const recordQuestion = useCallback((questionId, audioBlob) => {
    setRecordings((prev) => ({ ...prev, [questionId]: audioBlob }));
    setIsRecording(false);
    // Update question status in activeSession
    setActiveSession((prev) => {
      if (!prev?.questions) return prev;
      return {
        ...prev,
        questions: prev.questions.map((q) => (q.id === questionId ? { ...q, status: 'uploaded', audioRecordingUrl: URL.createObjectURL(audioBlob), recordedAt: new Date().toISOString() } : q)),
      };
    });
  }, []);

  const startRecording = useCallback(() => setIsRecording(true), []);
  const stopRecording = useCallback(() => setIsRecording(false), []);

  /* ── Navigation ── */
  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex((i) => {
      if (!activeSession?.questions) return i;
      return Math.min(i + 1, activeSession.questions.length - 1);
    });
  }, [activeSession]);

  const previousQuestion = useCallback(() => {
    setCurrentQuestionIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goToQuestion = useCallback((index) => {
    setCurrentQuestionIndex(index);
  }, []);

  /* ── Analysis (mock) ── */
  const analyzeRecording = useCallback(async (questionId) => {
    await new Promise((r) => setTimeout(r, 1500));
    const analysis = {
      speechRate: 110 + Math.floor(Math.random() * 50),
      pauseDuration: +(0.8 + Math.random() * 3).toFixed(1),
      fillerWords: Math.floor(Math.random() * 8),
      coherenceScore: 55 + Math.floor(Math.random() * 40),
      sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
      confidence: +(0.7 + Math.random() * 0.25).toFixed(2),
    };
    setActiveSession((prev) => {
      if (!prev?.questions) return prev;
      return {
        ...prev,
        questions: prev.questions.map((q) => (q.id === questionId ? { ...q, status: 'analyzed', analysis } : q)),
      };
    });
    return analysis;
  }, []);

  const generateReport = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 2000));
    if (!activeSession?.questions) return null;
    const analyzed = activeSession.questions.filter((q) => q.analysis);
    const avgCoherence = analyzed.length ? analyzed.reduce((a, q) => a + q.analysis.coherenceScore, 0) / analyzed.length : 50;
    const riskScore = Math.max(0, Math.min(100, Math.round(100 - avgCoherence)));
    return {
      riskScore,
      classification: riskScore <= 30 ? 'healthy' : riskScore <= 60 ? 'mild-concern' : 'high-risk',
      voiceMarkers: [
        { name: 'Speech Rate', value: `${Math.round(analyzed.reduce((a, q) => a + q.analysis.speechRate, 0) / (analyzed.length || 1))} wpm`, status: 'Normal', reference: '110–150' },
        { name: 'Avg Pause', value: `${(analyzed.reduce((a, q) => a + q.analysis.pauseDuration, 0) / (analyzed.length || 1)).toFixed(1)}s`, status: riskScore > 40 ? 'Elevated' : 'Normal', reference: '<3.0s' },
        { name: 'Filler Words', value: `${Math.round(analyzed.reduce((a, q) => a + q.analysis.fillerWords, 0) / (analyzed.length || 1))}`, status: 'Normal', reference: '<5 per answer' },
        { name: 'Coherence', value: `${Math.round(avgCoherence)}/100`, status: riskScore > 50 ? 'Low' : 'Good', reference: '>70' },
      ],
      recommendations: riskScore <= 30
        ? ['Continue regular screenings', 'Healthy cognitive function observed']
        : riskScore <= 60
          ? ['Schedule follow-up in 2 weeks', 'Consider neuropsych evaluation']
          : ['Urgent neurological referral recommended', 'Comprehensive assessment needed'],
      generatedAt: new Date().toISOString(),
    };
  }, [activeSession]);

  const currentQuestion = activeSession?.questions?.[currentQuestionIndex] ?? null;
  const totalQuestions = activeSession?.questions?.length ?? 0;
  const completedCount = activeSession?.questions?.filter((q) => q.status === 'analyzed' || q.status === 'uploaded')?.length ?? 0;

  return (
    <SessionContext.Provider value={{
      activeSession, currentQuestionIndex, currentQuestion, totalQuestions, completedCount,
      recordings, isRecording, isPaused, elapsedTime,
      startSession, pauseSession, resumeSession, endSession,
      recordQuestion, startRecording, stopRecording,
      nextQuestion, previousQuestion, goToQuestion,
      analyzeRecording, generateReport,
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
