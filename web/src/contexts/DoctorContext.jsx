import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { mockDoctor, mockPatients, mockSessions, mockQuestionBank } from '../utils/mockData';

const DoctorContext = createContext(null);

const LS_DOCTOR = 'echomind_doctor';
const LS_PATIENTS = 'echomind_patients';
const LS_SESSIONS = 'echomind_sessions';
const LS_QUESTIONS = 'echomind_questions';

function loadLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}

export function DoctorProvider({ children }) {
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [questionBank, setQuestionBank] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Load data on mount — prefer localStorage, fall back to mock */
  useEffect(() => {
    const doc = loadLS(LS_DOCTOR, null);
    if (doc) setCurrentDoctor(doc);
    setPatients(loadLS(LS_PATIENTS, mockPatients));
    setSessions(loadLS(LS_SESSIONS, mockSessions));
    setQuestionBank(loadLS(LS_QUESTIONS, mockQuestionBank));
    setLoading(false);
  }, []);

  /* Persist to localStorage on change */
  useEffect(() => { if (!loading) localStorage.setItem(LS_PATIENTS, JSON.stringify(patients)); }, [patients, loading]);
  useEffect(() => { if (!loading) localStorage.setItem(LS_SESSIONS, JSON.stringify(sessions)); }, [sessions, loading]);
  useEffect(() => { if (!loading) localStorage.setItem(LS_QUESTIONS, JSON.stringify(questionBank)); }, [questionBank, loading]);

  /* ── Auth ── */
  const login = useCallback(async (email, _password) => {
    await new Promise((r) => setTimeout(r, 600));
    const doc = { ...mockDoctor, email };
    setCurrentDoctor(doc);
    localStorage.setItem(LS_DOCTOR, JSON.stringify(doc));
    return doc;
  }, []);

  const signup = useCallback(async (data) => {
    await new Promise((r) => setTimeout(r, 1200));
    // In real app: POST to /api/auth/signup
    return { success: true, message: 'Application submitted' };
  }, []);

  const logout = useCallback(() => {
    setCurrentDoctor(null);
    localStorage.removeItem(LS_DOCTOR);
  }, []);

  const resetData = useCallback(() => {
    setPatients(mockPatients);
    setSessions(mockSessions);
    setQuestionBank(mockQuestionBank);
    localStorage.removeItem(LS_PATIENTS);
    localStorage.removeItem(LS_SESSIONS);
    localStorage.removeItem(LS_QUESTIONS);
  }, []);

  /* ── Patients ── */
  const addPatient = useCallback((data) => {
    const patient = { ...data, id: `pat_${Date.now()}`, doctorId: currentDoctor?.id, addedDate: new Date().toISOString(), lastSessionDate: null, totalSessions: 0 };
    setPatients((prev) => [patient, ...prev]);
    return patient;
  }, [currentDoctor]);

  const updatePatient = useCallback((patientId, updates) => {
    setPatients((prev) => prev.map((p) => (p.id === patientId ? { ...p, ...updates } : p)));
  }, []);

  const deletePatient = useCallback((patientId) => {
    setPatients((prev) => prev.filter((p) => p.id !== patientId));
    setSessions((prev) => prev.filter((s) => s.patientId !== patientId));
  }, []);

  const getPatient = useCallback((patientId) => patients.find((p) => p.id === patientId) || null, [patients]);

  /* ── Sessions ── */
  const createSession = useCallback((patientId, questionIds) => {
    const qs = questionIds.map((qid, i) => {
      const q = questionBank.find((x) => x.id === qid);
      return { id: `sq_${Date.now()}_${i}`, questionText: q?.questionText || '', order: i + 1, audioRecordingUrl: null, duration: 0, status: 'pending', analysis: null, recordedAt: null };
    });
    const session = {
      id: `ses_${Date.now()}`, patientId, doctorId: currentDoctor?.id, sessionDate: new Date().toISOString(),
      status: 'in-progress', questions: qs, overallReport: null, sessionDuration: 0, notes: '', createdAt: new Date().toISOString(), completedAt: null,
    };
    setSessions((prev) => [session, ...prev]);
    setPatients((prev) => prev.map((p) => (p.id === patientId ? { ...p, totalSessions: p.totalSessions + 1 } : p)));
    return session;
  }, [currentDoctor, questionBank]);

  const updateSession = useCallback((sessionId, updates) => {
    setSessions((prev) => prev.map((s) => (s.id === sessionId ? { ...s, ...updates } : s)));
  }, []);

  const completeSession = useCallback((sessionId, report) => {
    setSessions((prev) => prev.map((s) => {
      if (s.id !== sessionId) return s;
      return { ...s, status: 'completed', overallReport: report, completedAt: new Date().toISOString() };
    }));
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setPatients((prev) => prev.map((p) => (p.id === session.patientId ? { ...p, lastSessionDate: new Date().toISOString() } : p)));
    }
  }, [sessions]);

  const getPatientSessions = useCallback((patientId) => sessions.filter((s) => s.patientId === patientId).sort((a, b) => new Date(b.sessionDate) - new Date(a.sessionDate)), [sessions]);

  const getSession = useCallback((sessionId) => sessions.find((s) => s.id === sessionId) || null, [sessions]);

  /* ── Questions ── */
  const addCustomQuestion = useCallback((data) => {
    const q = { ...data, id: `q_${Date.now()}`, isDefault: false, usageCount: 0 };
    setQuestionBank((prev) => [...prev, q]);
    return q;
  }, []);

  const deleteQuestion = useCallback((questionId) => {
    setQuestionBank((prev) => prev.filter((q) => q.id !== questionId));
  }, []);

  const addQuestion = useCallback((data) => {
    const q = { ...data, id: `q_${Date.now()}`, isDefault: false, usageCount: 0 };
    setQuestionBank((prev) => [...prev, q]);
    return q;
  }, []);

  return (
    <DoctorContext.Provider value={{
      currentDoctor, loading, isAuthenticated: !!currentDoctor,
      login, signup, logout, resetData,
      patients, addPatient, updatePatient, deletePatient, getPatient,
      sessions, createSession, updateSession, completeSession, getPatientSessions, getSession,
      questionBank, addCustomQuestion, addQuestion, deleteQuestion,
    }}>
      {children}
    </DoctorContext.Provider>
  );
}

export function useDoctor() {
  const ctx = useContext(DoctorContext);
  if (!ctx) throw new Error('useDoctor must be used within DoctorProvider');
  return ctx;
}
