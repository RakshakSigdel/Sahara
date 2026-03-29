import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { login as loginAuth } from "../services/authService";
import { getUser } from "../services/userService";
import {
  getPatientsByDoctor,
  createPatient as createPatientFirebase,
  updatePatient as updatePatientFirebase,
  deletePatient as deletePatientFirebase,
  getPatient as getPatientFirebase,
} from "../services/patientService";
import {
  getSessionsByDoctor,
  createSession as createSessionFirebase,
  updateSession as updateSessionFirebase,
  completeSession as completeSessionFirebase,
  getSessionsByPatient as getSessionsByPatientFirebase,
} from "../services/sessionService";
import {
  getAllQuestions,
  createQuestion as createQuestionFirebase,
  deleteQuestion as deleteQuestionFirebase,
} from "../services/questionService";

const DoctorContext = createContext(null);

export function DoctorProvider({ children }) {
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [questionBank, setQuestionBank] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  /* Initialize auth listener and load user data from Firebase */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userData = await getUser(firebaseUser.uid);
          if (userData) {
            setCurrentDoctor({ id: firebaseUser.uid, ...userData });
          }
        } else {
          setCurrentDoctor(null);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setAuthLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  /* Load Firebase data when doctor is set */
  useEffect(() => {
    const loadFirebaseData = async () => {
      try {
        if (currentDoctor?.id) {
          // Load patients for this doctor
          const patientsData = await getPatientsByDoctor(currentDoctor.id);
          setPatients(patientsData);

          // Load sessions for this doctor
          const sessionsData = await getSessionsByDoctor(currentDoctor.id);
          setSessions(sessionsData);

          // Load all questions
          const questionsData = await getAllQuestions();
          setQuestionBank(questionsData);
        } else {
          setPatients([]);
          setSessions([]);
          setQuestionBank([]);
        }
      } catch (error) {
        console.error("Error loading Firebase data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadFirebaseData();
    }
  }, [currentDoctor, authLoading]);

  const login = useCallback(async (email, password) => {
    try {
      const user = await loginAuth(email, password);
      return user;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentDoctor(null);
  }, []);

  const resetData = useCallback(async () => {
    setPatients([]);
    setSessions([]);
    setQuestionBank([]);
  }, []);

  /* ── Patients ── */
  const addPatient = useCallback(
    async (data) => {
      try {
        const patientData = {
          ...data,
          doctorId: currentDoctor?.id,
          addedDate: new Date().toISOString(),
          lastSessionDate: null,
          totalSessions: 0,
        };
        const patientId = await createPatientFirebase(patientData);
        const newPatient = { id: patientId, ...patientData };
        setPatients((prev) => [newPatient, ...prev]);
        return newPatient;
      } catch (error) {
        console.error("Error adding patient:", error);
        throw error;
      }
    },
    [currentDoctor],
  );

  const updatePatient = useCallback(async (patientId, updates) => {
    try {
      await updatePatientFirebase(patientId, updates);
      setPatients((prev) =>
        prev.map((p) => (p.id === patientId ? { ...p, ...updates } : p)),
      );
    } catch (error) {
      console.error("Error updating patient:", error);
      throw error;
    }
  }, []);

  const deletePatient = useCallback(async (patientId) => {
    try {
      await deletePatientFirebase(patientId);
      setPatients((prev) => prev.filter((p) => p.id !== patientId));
      setSessions((prev) => prev.filter((s) => s.patientId !== patientId));
    } catch (error) {
      console.error("Error deleting patient:", error);
      throw error;
    }
  }, []);

  const getPatient = useCallback(
    (patientId) => patients.find((p) => p.id === patientId) || null,
    [patients],
  );

  /* ── Sessions ── */
  const createSession = useCallback(
    async (patientId, questionIds) => {
      try {
        const sessionData = {
          patientId,
          doctorId: currentDoctor?.id,
          sessionDate: new Date().toISOString(),
          status: "active",
          questions: questionIds.map((qid, i) => {
            const q = questionBank.find((x) => x.id === qid);
            return {
              id: `sq_${Date.now()}_${i}`,
              questionText: q?.questionText || "",
              order: i + 1,
              audioRecordingUrl: null,
              duration: 0,
              status: "pending",
              analysis: null,
              recordedAt: null,
            };
          }),
          overallReport: null,
          sessionDuration: 0,
          notes: "",
        };
        const sessionId = await createSessionFirebase(sessionData);
        const newSession = { id: sessionId, ...sessionData };
        setSessions((prev) => [newSession, ...prev]);

        // Increment patient session count
        const patient = await getPatientFirebase(patientId);
        if (patient) {
          const currentCount = patient.totalSessions || 0;
          await updatePatient(patientId, { totalSessions: currentCount + 1 });
        }

        return newSession;
      } catch (error) {
        console.error("Error creating session:", error);
        throw error;
      }
    },
    [currentDoctor, questionBank, updatePatient],
  );

  const updateSession = useCallback(async (sessionId, updates) => {
    try {
      await updateSessionFirebase(sessionId, updates);
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, ...updates } : s)),
      );
    } catch (error) {
      console.error("Error updating session:", error);
      throw error;
    }
  }, []);

  const completeSession = useCallback(
    async (sessionId, report) => {
      try {
        await completeSessionFirebase(sessionId, report);
        const session = sessions.find((s) => s.id === sessionId);
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== sessionId) return s;
            return {
              ...s,
              status: "completed",
              overallReport: report,
              completedAt: new Date().toISOString(),
            };
          }),
        );
        if (session) {
          await updatePatient(session.patientId, {
            lastSessionDate: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error("Error completing session:", error);
        throw error;
      }
    },
    [sessions, updatePatient],
  );

  const getPatientSessions = useCallback(
    (patientId) =>
      sessions
        .filter((s) => s.patientId === patientId)
        .sort((a, b) => new Date(b.sessionDate) - new Date(a.sessionDate)),
    [sessions],
  );

  const getSessionsByPatient = useCallback(async (patientId) => {
    try {
      return await getSessionsByPatientFirebase(patientId);
    } catch (error) {
      console.error("Error fetching sessions by patient:", error);
      throw error;
    }
  }, []);

  const getSession = useCallback(
    (sessionId) => sessions.find((s) => s.id === sessionId) || null,
    [sessions],
  );

  /* ── Questions ── */
  const addQuestion = useCallback(async (data) => {
    try {
      const questionData = {
        ...data,
        isDefault: false,
        usageCount: 0,
      };
      const questionId = await createQuestionFirebase(questionData);
      const newQuestion = { id: questionId, ...questionData };
      setQuestionBank((prev) => [...prev, newQuestion]);
      return newQuestion;
    } catch (error) {
      console.error("Error adding question:", error);
      throw error;
    }
  }, []);

  const deleteQuestion = useCallback(async (questionId) => {
    try {
      await deleteQuestionFirebase(questionId);
      setQuestionBank((prev) => prev.filter((q) => q.id !== questionId));
    } catch (error) {
      console.error("Error deleting question:", error);
      throw error;
    }
  }, []);

  return (
    <DoctorContext.Provider
      value={{
        currentDoctor,
        loading: loading || authLoading,
        isAuthenticated: !!currentDoctor,
        login,
        logout,
        resetData,
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        getPatient,
        sessions,
        createSession,
        updateSession,
        completeSession,
        getPatientSessions,
        getSessionsByPatient,
        getSession,
        questionBank,
        addQuestion,
        deleteQuestion,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDoctor() {
  const ctx = useContext(DoctorContext);
  if (!ctx) throw new Error("useDoctor must be used within DoctorProvider");
  return ctx;
}
