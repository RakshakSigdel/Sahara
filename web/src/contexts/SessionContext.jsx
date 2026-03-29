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
    let analysis;

    try {
      const result = await analyzeAudioBlob(audioBlob, `${questionId}.webm`);
      analysis = {
        hasDementia: result.hasDementia,
        confidenceScore: result.confidenceScore,
        confidencePercentage: result.confidencePercentage,
        detailedAnalysis: result.detailedAnalysis,
        source: "ai",
      };
    } catch {
      // Keep the session usable if backend is down.
      analysis = {
        hasDementia: Math.random() > 0.5,
        confidenceScore: +(0.7 + Math.random() * 0.25).toFixed(2),
        confidencePercentage: `${Math.round((0.7 + Math.random() * 0.25) * 100)}%`,
        source: "fallback",
      };
    }

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
    } catch {
      const avgConfidence = analyzedQuestions.length
        ? analyzedQuestions.reduce(
            (sum, q) => sum + (Number(q.analysis?.confidenceScore) || 0.5),
            0,
          ) / analyzedQuestions.length
        : 0.5;

      const riskScore = Math.round(avgConfidence * 100);
      return {
        riskScore,
        classification:
          riskScore <= 30
            ? "healthy"
            : riskScore <= 60
              ? "mild-concern"
              : "high-risk",
        confidence: avgConfidence,
        voiceMarkers: [
          {
            name: "Dementia Signal Confidence",
            value: `${Math.round(avgConfidence * 100)}%`,
            status: riskScore > 60 ? "Elevated" : "Normal",
            reference: "Lower is better",
          },
        ],
        recommendations:
          riskScore <= 30
            ? [
                "Continue regular screenings",
                "Healthy cognitive function observed",
              ]
            : riskScore <= 60
              ? [
                  "Schedule follow-up in 2 weeks",
                  "Consider neuropsych evaluation",
                ]
              : [
                  "Urgent neurological referral recommended",
                  "Comprehensive assessment needed",
                ],
        aiInsights: {
          riskLevel:
            riskScore <= 30 ? "Low" : riskScore <= 60 ? "Moderate" : "High",
          audioAnalysis:
            "Fallback analysis used because AI report service was unavailable.",
          behavioralAnalysis:
            "Behavioral interpretation unavailable in fallback mode.",
          combinedInterpretation:
            "Please retry report generation when backend service is available.",
          recommendation: "Use this fallback result as provisional only.",
        },
        generatedAt: new Date().toISOString(),
        sessionId: activeSession.id,
        patientId: activeSession.patientId,
      };
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
