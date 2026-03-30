import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { analyzeAudioBlob, generateAiReport } from "../services/aiService";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [activeSession, setActiveSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordings, setRecordings] = useState({}); // { questionId: blob }
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);

  /* ── Session lifecycle ── */
  const startSession = useCallback((sessionDataOrPatientId, questions) => {
    let sessionData;

    if (
      typeof sessionDataOrPatientId === "object" &&
      sessionDataOrPatientId !== null &&
      sessionDataOrPatientId.id
    ) {
      // Called with a Firebase session object (from DoctorContext.createSession)
      sessionData = {
        ...sessionDataOrPatientId,
        status: "in-progress",
      };
    } else if (
      typeof sessionDataOrPatientId === "string" &&
      Array.isArray(questions)
    ) {
      // Legacy: Called as startSession(patientId, questions) from SessionSetupPage
      sessionData = {
        id: `ses_${Date.now()}`,
        patientId: sessionDataOrPatientId,
        questions: questions.map((q, i) => ({
          id: q.id || `sq_${Date.now()}_${i}`,
          questionText: q.questionText || "",
          category: q.category || "General",
          expectedDuration: q.expectedDuration || 60,
          order: i + 1,
          status: "pending",
          analysis: null,
          audioRecordingUrl: null,
          recordedAt: null,
        })),
        status: "in-progress",
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
    if (timerRef.current) clearInterval(timerRef.current);
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
    setElapsedTime(0);
    setCurrentQuestionIndex(0);
    setRecordings({});
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
        questions: prev.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                status: "uploaded",
                audioRecordingUrl: URL.createObjectURL(audioBlob),
                recordedAt: new Date().toISOString(),
              }
            : q,
        ),
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
  const analyzeRecording = useCallback(async (questionId, audioBlob) => {
    if (!questionId) throw new Error("Question ID is required for analysis");

    try {
      const result = await analyzeAudioBlob(audioBlob, `${questionId}.webm`);
      const analysis = {
        hasDementia: result.hasDementia,
        confidenceScore: result.confidenceScore,
        confidencePercentage: result.confidencePercentage,
        detailedAnalysis: result.detailedAnalysis,
        source: "ai",
      };

      setActiveSession((prev) => {
        if (!prev?.questions) return prev;
        return {
          ...prev,
          questions: prev.questions.map((q) =>
            q.id === questionId ? { ...q, status: "analyzed", analysis } : q,
          ),
        };
      });

      return analysis;
    } catch (error) {
      console.error("Failed to analyze recording", error);
      throw error;
    }
  }, []);

  const generateReport = useCallback(async () => {
    if (!activeSession?.questions) return null;

    const analyzedQuestions = activeSession.questions.filter((q) => q.analysis);

    const audioResults = analyzedQuestions.map((q) => ({
      question: q.questionText || "Question",
      has_dementia: !!q.analysis?.hasDementia,
      confidence_score: Number(q.analysis?.confidenceScore) || 0,
    }));

    const qaResponses = analyzedQuestions.map((q) => ({
      question: q.questionText || "Question",
      answer: q.analysis?.transcript || "Audio response analyzed.",
    }));

    try {
      const aiReport = await generateAiReport(audioResults, qaResponses);
      return {
        ...aiReport,
        sessionId: activeSession.id,
        patientId: activeSession.patientId,
      };
    } catch (error) {
      console.error("Failed to generate AI report", error);
      throw error;
    }
  }, [activeSession]);

  const currentQuestion =
    activeSession?.questions?.[currentQuestionIndex] ?? null;
  const totalQuestions = activeSession?.questions?.length ?? 0;
  const completedCount =
    activeSession?.questions?.filter(
      (q) => q.status === "analyzed" || q.status === "uploaded",
    )?.length ?? 0;

  return (
    <SessionContext.Provider
      value={{
        activeSession,
        currentQuestionIndex,
        currentQuestion,
        totalQuestions,
        completedCount,
        recordings,
        isRecording,
        isPaused,
        elapsedTime,
        startSession,
        pauseSession,
        resumeSession,
        endSession,
        recordQuestion,
        startRecording,
        stopRecording,
        nextQuestion,
        previousQuestion,
        goToQuestion,
        analyzeRecording,
        generateReport,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
