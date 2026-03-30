/* ═══════════════════════════════════════════
  Mock API — Doctor-Centric Bhul Rakshak
   ═══════════════════════════════════════════ */

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

/* ── Doctor Auth ── */
export async function doctorLogin(email, password) {
  await delay(800);
  return { id: 'doc_001', fullName: 'Dr. Anita Sharma', email, specialty: 'Neurology', hospital: 'City Neurological Center' };
}

export async function doctorSignup(doctorData) {
  await delay(800);
  return { id: `doc_${Date.now()}`, ...doctorData, createdAt: new Date().toISOString() };
}

export async function doctorLogout() {
  await delay(200);
  return { success: true };
}

/* ── Patient Management ── */
export async function addPatientAPI(doctorId, patientData) {
  await delay(500);
  return { id: `pat_${Date.now()}`, doctorId, ...patientData, addedDate: new Date().toISOString(), totalSessions: 0 };
}

export async function getPatientsAPI(doctorId) {
  await delay(400);
  // Returns from context/mock in real usage
  return [];
}

export async function updatePatientAPI(patientId, updates) {
  await delay(400);
  return { id: patientId, ...updates, updatedAt: new Date().toISOString() };
}

export async function deletePatientAPI(patientId) {
  await delay(500);
  return { success: true, deletedId: patientId };
}

/* ── Session Management ── */
export async function createSessionAPI(patientId, questionSet) {
  await delay(500);
  return { id: `ses_${Date.now()}`, patientId, status: 'in-progress', createdAt: new Date().toISOString() };
}

export async function getSessionsAPI(patientId) {
  await delay(400);
  return [];
}

export async function updateSessionAPI(sessionId, updates) {
  await delay(300);
  return { id: sessionId, ...updates };
}

export async function uploadRecordingAPI(sessionId, questionId, audioBlob) {
  await delay(1000);
  return { sessionId, questionId, url: `/recordings/${questionId}.webm`, uploadedAt: new Date().toISOString() };
}

export async function analyzeRecordingAPI(recordingId) {
  await delay(2000);
  return {
    speechRate: 110 + Math.floor(Math.random() * 50),
    pauseDuration: +(0.8 + Math.random() * 3).toFixed(1),
    fillerWords: Math.floor(Math.random() * 8),
    coherenceScore: 55 + Math.floor(Math.random() * 40),
    sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
    confidence: +(0.7 + Math.random() * 0.25).toFixed(2),
  };
}

export async function generateSessionReportAPI(sessionId) {
  await delay(3000);
  const score = 20 + Math.floor(Math.random() * 50);
  return {
    riskScore: score,
    classification: score <= 30 ? 'healthy' : score <= 60 ? 'mild-concern' : 'high-risk',
    generatedAt: new Date().toISOString(),
  };
}

/* ── Question Bank ── */
export async function getQuestionBankAPI() {
  await delay(300);
  return [];
}

export async function addCustomQuestionAPI(questionData) {
  await delay(400);
  return { id: `q_${Date.now()}`, ...questionData, isDefault: false, usageCount: 0 };
}
