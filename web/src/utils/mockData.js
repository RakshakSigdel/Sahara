/* ═══════════════════════════════════════════
   Mock Data — Doctor-Centric Sahara
   ═══════════════════════════════════════════ */

// ── Doctor ──
export const mockDoctor = {
  id: 'doc_001',
  email: 'dr.sharma@Sahara.health',
  fullName: 'Dr. Anita Sharma',
  specialty: 'Neurology',
  license: 'NMC-2019-4572',
  hospital: 'City Neurological Center',
  phone: '+977-9841234567',
  profileImage: null,
  createdAt: '2025-03-15T08:00:00Z',
  settings: {
    defaultQuestionSet: ['q_01', 'q_02', 'q_03', 'q_05', 'q_08', 'q_10', 'q_14', 'q_18', 'q_22', 'q_26'],
    sessionDuration: 30,
    autoSaveInterval: 15,
  },
};

// ── Patients ──
export const mockPatients = [
  {
    id: 'pat_001', doctorId: 'doc_001', fullName: 'Ram Bahadur Thapa', dateOfBirth: '1952-08-14', gender: 'male',
    phone: '+977-9812345678', email: 'ram.thapa@gmail.com',
    emergencyContact: { name: 'Sita Thapa', phone: '+977-9812345679', relationship: 'Wife' },
    medicalHistory: 'Hypertension (controlled), Mild hearing loss', notes: 'Patient is cooperative, prefers Nepali language prompts.',
    addedDate: '2025-06-10', lastSessionDate: '2026-03-25', totalSessions: 4,
  },
  {
    id: 'pat_002', doctorId: 'doc_001', fullName: 'Sarita Devi Karki', dateOfBirth: '1958-02-22', gender: 'female',
    phone: '+977-9867654321', email: null,
    emergencyContact: { name: 'Bijay Karki', phone: '+977-9867654322', relationship: 'Son' },
    medicalHistory: 'Diabetes Type 2, Former smoker', notes: 'Baseline screening — referred by GP.',
    addedDate: '2025-09-05', lastSessionDate: '2026-03-20', totalSessions: 3,
  },
  {
    id: 'pat_003', doctorId: 'doc_001', fullName: 'Krishna Prasad Sharma', dateOfBirth: '1948-11-03', gender: 'male',
    phone: '+977-9801122334',
    emergencyContact: { name: 'Laxmi Sharma', phone: '+977-9801122335', relationship: 'Daughter' },
    medicalHistory: 'Previous stroke (2022), Atrial fibrillation', notes: 'Post-stroke monitoring. Shows slight word-finding difficulty.',
    addedDate: '2025-11-20', lastSessionDate: '2026-03-18', totalSessions: 4,
  },
  {
    id: 'pat_004', doctorId: 'doc_001', fullName: 'Maya Kumari Rai', dateOfBirth: '1960-05-17', gender: 'female',
    phone: '+977-9845566778',
    emergencyContact: { name: 'Prakash Rai', phone: '+977-9845566779', relationship: 'Husband' },
    medicalHistory: 'No significant history', notes: 'Family history of Alzheimer\'s. Proactive screening.',
    addedDate: '2026-01-08', lastSessionDate: '2026-03-22', totalSessions: 2,
  },
  {
    id: 'pat_005', doctorId: 'doc_001', fullName: 'Hari Bahadur Gurung', dateOfBirth: '1955-09-28', gender: 'male',
    phone: '+977-9823344556',
    emergencyContact: { name: 'Kamala Gurung', phone: '+977-9823344557', relationship: 'Wife' },
    medicalHistory: 'Depression (managed), Sleep apnea', notes: 'Monitor for depression-related cognitive effects.',
    addedDate: '2026-02-14', lastSessionDate: '2026-03-15', totalSessions: 2,
  },
  {
    id: 'pat_006', doctorId: 'doc_001', fullName: 'Parvati Shrestha', dateOfBirth: '1945-12-01', gender: 'female',
    phone: '+977-9811223344',
    emergencyContact: { name: 'Rajan Shrestha', phone: '+977-9811223345', relationship: 'Son' },
    medicalHistory: 'Hypertension, Osteoarthritis, Vitamin B12 deficiency (treated)', notes: 'Elderly patient — needs extra time. Previous screening showed mild concerns.',
    addedDate: '2025-07-22', lastSessionDate: '2026-03-10', totalSessions: 4,
  },
  {
    id: 'pat_007', doctorId: 'doc_001', fullName: 'Dil Bahadur Tamang', dateOfBirth: '1963-04-09', gender: 'male',
    phone: '+977-9856677889',
    emergencyContact: { name: 'Sunita Tamang', phone: '+977-9856677890', relationship: 'Wife' },
    medicalHistory: 'Type 2 Diabetes', notes: 'New patient — initial baseline.',
    addedDate: '2026-03-01', lastSessionDate: null, totalSessions: 0,
  },
];

// ── Question Bank (30+ questions) ──
export const mockQuestionBank = [
  // Memory
  { id: 'q_01', category: 'memory', questionText: 'Can you tell me what you had for breakfast this morning?', expectedDuration: 30, difficulty: 'easy', isDefault: true, usageCount: 42 },
  { id: 'q_02', category: 'memory', questionText: 'I\'m going to say three words. Please repeat them back: Apple, Table, Penny.', expectedDuration: 15, difficulty: 'easy', isDefault: true, usageCount: 45 },
  { id: 'q_03', category: 'memory', questionText: 'Can you describe what you did yesterday, from morning to evening?', expectedDuration: 60, difficulty: 'medium', isDefault: true, usageCount: 38 },
  { id: 'q_04', category: 'memory', questionText: 'Earlier I asked you to remember three words. Can you recall them now?', expectedDuration: 15, difficulty: 'medium', isDefault: false, usageCount: 36 },
  { id: 'q_05', category: 'memory', questionText: 'Can you name five items you would find in a grocery store?', expectedDuration: 30, difficulty: 'easy', isDefault: true, usageCount: 40 },
  { id: 'q_06', category: 'memory', questionText: 'Tell me the names and ages of your family members who live with you.', expectedDuration: 45, difficulty: 'easy', isDefault: false, usageCount: 22 },
  { id: 'q_07', category: 'memory', questionText: 'Can you describe a memorable event from the last month?', expectedDuration: 60, difficulty: 'medium', isDefault: false, usageCount: 28 },
  { id: 'q_08', category: 'memory', questionText: 'I will read you a short story. Please listen and then retell it in your own words.', expectedDuration: 90, difficulty: 'hard', isDefault: true, usageCount: 35 },

  // Cognition
  { id: 'q_09', category: 'cognition', questionText: 'Please count backwards from 100 by 7 (100, 93, 86...).', expectedDuration: 45, difficulty: 'hard', isDefault: false, usageCount: 30 },
  { id: 'q_10', category: 'cognition', questionText: 'Please count backwards from 20 to 1.', expectedDuration: 20, difficulty: 'easy', isDefault: true, usageCount: 44 },
  { id: 'q_11', category: 'cognition', questionText: 'Can you spell the word "WORLD" backwards?', expectedDuration: 15, difficulty: 'medium', isDefault: false, usageCount: 25 },
  { id: 'q_12', category: 'cognition', questionText: 'If you have 15 apples and give away 6, how many do you have?', expectedDuration: 15, difficulty: 'easy', isDefault: false, usageCount: 20 },
  { id: 'q_13', category: 'cognition', questionText: 'Can you explain the similarity between a banana and an orange?', expectedDuration: 30, difficulty: 'medium', isDefault: false, usageCount: 18 },
  { id: 'q_14', category: 'cognition', questionText: 'Please describe the steps you would take to prepare a cup of tea.', expectedDuration: 60, difficulty: 'medium', isDefault: true, usageCount: 32 },
  { id: 'q_15', category: 'cognition', questionText: 'What would you do if you found a stamped, addressed envelope on the street?', expectedDuration: 30, difficulty: 'medium', isDefault: false, usageCount: 15 },

  // Language
  { id: 'q_16', category: 'language', questionText: 'Please name as many animals as you can in 60 seconds.', expectedDuration: 60, difficulty: 'medium', isDefault: false, usageCount: 28 },
  { id: 'q_17', category: 'language', questionText: 'Can you describe everything you see in this room right now?', expectedDuration: 60, difficulty: 'easy', isDefault: false, usageCount: 22 },
  { id: 'q_18', category: 'language', questionText: 'Please tell me a story about your childhood — any happy memory.', expectedDuration: 90, difficulty: 'medium', isDefault: true, usageCount: 34 },
  { id: 'q_19', category: 'language', questionText: 'Can you explain what the phrase "A stitch in time saves nine" means?', expectedDuration: 30, difficulty: 'hard', isDefault: false, usageCount: 12 },
  { id: 'q_20', category: 'language', questionText: 'Please repeat: "No ifs, ands, or buts."', expectedDuration: 10, difficulty: 'easy', isDefault: false, usageCount: 30 },
  { id: 'q_21', category: 'language', questionText: 'Name as many words as you can that start with the letter "S" in 60 seconds.', expectedDuration: 60, difficulty: 'hard', isDefault: false, usageCount: 16 },
  { id: 'q_22', category: 'language', questionText: 'Describe your favorite festival or holiday and how you celebrate it.', expectedDuration: 90, difficulty: 'easy', isDefault: true, usageCount: 26 },

  // Orientation
  { id: 'q_23', category: 'orientation', questionText: 'What is today\'s date? Include the day, month, and year.', expectedDuration: 15, difficulty: 'easy', isDefault: false, usageCount: 40 },
  { id: 'q_24', category: 'orientation', questionText: 'What day of the week is it today?', expectedDuration: 10, difficulty: 'easy', isDefault: false, usageCount: 38 },
  { id: 'q_25', category: 'orientation', questionText: 'Can you tell me where we are right now? What city, building?', expectedDuration: 15, difficulty: 'easy', isDefault: false, usageCount: 36 },
  { id: 'q_26', category: 'orientation', questionText: 'What season is it currently? What is the weather like today?', expectedDuration: 20, difficulty: 'easy', isDefault: true, usageCount: 33 },
  { id: 'q_27', category: 'orientation', questionText: 'Who is the current head of state of this country?', expectedDuration: 15, difficulty: 'medium', isDefault: false, usageCount: 24 },
  { id: 'q_28', category: 'orientation', questionText: 'Can you tell me your full address and phone number?', expectedDuration: 20, difficulty: 'easy', isDefault: false, usageCount: 30 },

  // Additional mixed
  { id: 'q_29', category: 'cognition', questionText: 'I\'m going to tap the table. Please count how many times I tap.', expectedDuration: 20, difficulty: 'easy', isDefault: false, usageCount: 10 },
  { id: 'q_30', category: 'language', questionText: 'Can you read this sentence aloud and do what it says: "Close your eyes."', expectedDuration: 10, difficulty: 'easy', isDefault: false, usageCount: 28 },
  { id: 'q_31', category: 'memory', questionText: 'Tell me the names of the last three medications you took today.', expectedDuration: 20, difficulty: 'medium', isDefault: false, usageCount: 8 },
  { id: 'q_32', category: 'cognition', questionText: 'Draw a clock face showing 10 minutes past 11. Describe what you are drawing.', expectedDuration: 60, difficulty: 'hard', isDefault: false, usageCount: 20 },
];

// ── Mock analysis helper ──
function mockAnalysis(status) {
  if (status !== 'analyzed') return null;
  return {
    speechRate: 110 + Math.floor(Math.random() * 50),
    pauseDuration: +(0.8 + Math.random() * 3).toFixed(1),
    fillerWords: Math.floor(Math.random() * 8),
    coherenceScore: 55 + Math.floor(Math.random() * 40),
    sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
    confidence: +(0.7 + Math.random() * 0.25).toFixed(2),
  };
}

function mockReport(score) {
  const cls = score <= 30 ? 'healthy' : score <= 60 ? 'mild-concern' : 'high-risk';
  return {
    riskScore: score,
    classification: cls,
    voiceMarkers: [
      { name: 'Speech Rate', value: '135 wpm', status: 'Normal', reference: '110–150' },
      { name: 'Pause Duration', value: '2.4s avg', status: score > 40 ? 'Elevated' : 'Normal', reference: '<3.0s' },
      { name: 'Word Finding', value: `${1 + Math.floor(score / 20)} hesitations`, status: score > 50 ? 'Concerning' : 'Normal', reference: '<5' },
      { name: 'Filler Words', value: `${5 + Math.floor(score / 10)}%`, status: 'Normal', reference: '<12%' },
      { name: 'Coherence', value: `${95 - Math.floor(score * 0.6)}/100`, status: score > 50 ? 'Slightly Low' : 'Good', reference: '>70' },
    ],
    recommendations: cls === 'healthy'
      ? ['Continue regular screenings', 'Maintain physical activity', 'Good cognitive health indicators']
      : cls === 'mild-concern'
        ? ['Schedule follow-up in 2 weeks', 'Consider neuropsychological evaluation', 'Monitor speech patterns for changes']
        : ['Refer to neurologist immediately', 'Schedule comprehensive cognitive assessment', 'Inform family members'],
    generatedAt: new Date().toISOString(),
  };
}

// ── Sessions ──
function buildQuestions(questionIds, completionLevel) {
  return questionIds.map((qid, i) => {
    const q = mockQuestionBank.find((x) => x.id === qid) || { questionText: 'Unknown question' };
    const shouldComplete = i < completionLevel;
    const status = shouldComplete ? 'analyzed' : i === completionLevel ? 'uploaded' : 'pending';
    return {
      id: `sq_${qid}_${Math.random().toString(36).slice(2, 6)}`,
      questionText: q.questionText,
      order: i + 1,
      audioRecordingUrl: shouldComplete ? `/recordings/${qid}.webm` : null,
      duration: shouldComplete ? 15 + Math.floor(Math.random() * 60) : 0,
      status,
      analysis: mockAnalysis(status),
      recordedAt: shouldComplete ? new Date(Date.now() - Math.random() * 1e8).toISOString() : null,
    };
  });
}

const defaultQs = ['q_01', 'q_02', 'q_03', 'q_05', 'q_08', 'q_10', 'q_14', 'q_18', 'q_22', 'q_26'];

export const mockSessions = [
  // Patient 1 — 4 sessions
  { id: 'ses_001', patientId: 'pat_001', doctorId: 'doc_001', sessionDate: '2026-03-25T10:30:00Z', status: 'completed', questions: buildQuestions(defaultQs, 10), overallReport: mockReport(24), sessionDuration: 1260, notes: 'Patient was cooperative and engaged.', createdAt: '2026-03-25T10:30:00Z', completedAt: '2026-03-25T10:51:00Z' },
  { id: 'ses_002', patientId: 'pat_001', doctorId: 'doc_001', sessionDate: '2026-02-20T14:00:00Z', status: 'completed', questions: buildQuestions(defaultQs, 10), overallReport: mockReport(28), sessionDuration: 1380, notes: '', createdAt: '2026-02-20T14:00:00Z', completedAt: '2026-02-20T14:23:00Z' },
  { id: 'ses_003', patientId: 'pat_001', doctorId: 'doc_001', sessionDate: '2026-01-15T09:00:00Z', status: 'completed', questions: buildQuestions(defaultQs, 10), overallReport: mockReport(30), sessionDuration: 1440, notes: 'Slightly slower responses than previous session.', createdAt: '2026-01-15T09:00:00Z', completedAt: '2026-01-15T09:24:00Z' },
  { id: 'ses_004', patientId: 'pat_001', doctorId: 'doc_001', sessionDate: '2025-12-10T11:00:00Z', status: 'completed', questions: buildQuestions(defaultQs, 10), overallReport: mockReport(22), sessionDuration: 1200, notes: 'Baseline session.', createdAt: '2025-12-10T11:00:00Z', completedAt: '2025-12-10T11:20:00Z' },

  // Patient 2 — 3 sessions
  { id: 'ses_005', patientId: 'pat_002', doctorId: 'doc_001', sessionDate: '2026-03-20T15:00:00Z', status: 'completed', questions: buildQuestions(defaultQs, 10), overallReport: mockReport(38), sessionDuration: 1500, notes: 'Some word-finding difficulty noted.', createdAt: '2026-03-20T15:00:00Z', completedAt: '2026-03-20T15:25:00Z' },
  { id: 'ses_006', patientId: 'pat_002', doctorId: 'doc_001', sessionDate: '2026-02-10T10:00:00Z', status: 'completed', questions: buildQuestions(defaultQs, 10), overallReport: mockReport(35), sessionDuration: 1320, notes: '', createdAt: '2026-02-10T10:00:00Z', completedAt: '2026-02-10T10:22:00Z' },
  { id: 'ses_007', patientId: 'pat_002', doctorId: 'doc_001', sessionDate: '2025-11-05T11:30:00Z', status: 'completed', questions: buildQuestions(defaultQs, 10), overallReport: mockReport(32), sessionDuration: 1260, notes: 'Initial screening.', createdAt: '2025-11-05T11:30:00Z', completedAt: '2025-11-05T11:51:00Z' },

  // Patient 3 — 4 sessions, one interrupted
  { id: 'ses_008', patientId: 'pat_003', doctorId: 'doc_001', sessionDate: '2026-03-18T09:30:00Z', status: 'completed', questions: buildQuestions(defaultQs, 10), overallReport: mockReport(52), sessionDuration: 1620, notes: 'Elevated pause durations. Recommend follow-up.', createdAt: '2026-03-18T09:30:00Z', completedAt: '2026-03-18T09:57:00Z' },
  { id: 'ses_009', patientId: 'pat_003', doctorId: 'doc_001', sessionDate: '2026-02-15T14:00:00Z', status: 'interrupted', questions: buildQuestions(defaultQs, 6), overallReport: null, sessionDuration: 840, notes: 'Patient felt tired, stopped at question 7.', createdAt: '2026-02-15T14:00:00Z', completedAt: null },
  { id: 'ses_010', patientId: 'pat_003', doctorId: 'doc_001', sessionDate: '2026-01-10T10:00:00Z', status: 'completed', questions: buildQuestions(defaultQs, 10), overallReport: mockReport(48), sessionDuration: 1500, notes: '', createdAt: '2026-01-10T10:00:00Z', completedAt: '2026-01-10T10:25:00Z' },
  { id: 'ses_011', patientId: 'pat_003', doctorId: 'doc_001', sessionDate: '2025-12-01T11:00:00Z', status: 'completed', questions: buildQuestions(defaultQs, 10), overallReport: mockReport(45), sessionDuration: 1380, notes: 'Baseline post-stroke.', createdAt: '2025-12-01T11:00:00Z', completedAt: '2025-12-01T11:23:00Z' },

  // Patient 4 — 2 sessions
  { id: 'ses_012', patientId: 'pat_004', doctorId: 'doc_001', sessionDate: '2026-03-22T16:00:00Z', status: 'completed', questions: buildQuestions(defaultQs, 10), overallReport: mockReport(18), sessionDuration: 1080, notes: 'Excellent cognitive function.', createdAt: '2026-03-22T16:00:00Z', completedAt: '2026-03-22T16:18:00Z' },
  { id: 'ses_013', patientId: 'pat_004', doctorId: 'doc_001', sessionDate: '2026-02-05T10:00:00Z', status: 'completed', questions: buildQuestions(defaultQs, 10), overallReport: mockReport(20), sessionDuration: 1140, notes: 'Proactive screening — family history.', createdAt: '2026-02-05T10:00:00Z', completedAt: '2026-02-05T10:19:00Z' },

  // Patient 5 — 2 sessions
  { id: 'ses_014', patientId: 'pat_005', doctorId: 'doc_001', sessionDate: '2026-03-15T13:00:00Z', status: 'completed', questions: buildQuestions(defaultQs, 10), overallReport: mockReport(34), sessionDuration: 1320, notes: 'Depression may be affecting results. Monitor.', createdAt: '2026-03-15T13:00:00Z', completedAt: '2026-03-15T13:22:00Z' },
  { id: 'ses_015', patientId: 'pat_005', doctorId: 'doc_001', sessionDate: '2026-02-28T15:00:00Z', status: 'completed', questions: buildQuestions(defaultQs, 10), overallReport: mockReport(36), sessionDuration: 1380, notes: '', createdAt: '2026-02-28T15:00:00Z', completedAt: '2026-02-28T15:23:00Z' },

  // Patient 6 — 4 sessions
  { id: 'ses_016', patientId: 'pat_006', doctorId: 'doc_001', sessionDate: '2026-03-10T10:00:00Z', status: 'completed', questions: buildQuestions(defaultQs, 10), overallReport: mockReport(58), sessionDuration: 1800, notes: 'Significant pauses. Coherence declining.', createdAt: '2026-03-10T10:00:00Z', completedAt: '2026-03-10T10:30:00Z' },
  { id: 'ses_017', patientId: 'pat_006', doctorId: 'doc_001', sessionDate: '2026-02-01T14:00:00Z', status: 'completed', questions: buildQuestions(defaultQs, 10), overallReport: mockReport(54), sessionDuration: 1680, notes: '', createdAt: '2026-02-01T14:00:00Z', completedAt: '2026-02-01T14:28:00Z' },
  { id: 'ses_018', patientId: 'pat_006', doctorId: 'doc_001', sessionDate: '2025-12-20T10:00:00Z', status: 'completed', questions: buildQuestions(defaultQs, 10), overallReport: mockReport(50), sessionDuration: 1560, notes: '', createdAt: '2025-12-20T10:00:00Z', completedAt: '2025-12-20T10:26:00Z' },
  { id: 'ses_019', patientId: 'pat_006', doctorId: 'doc_001', sessionDate: '2025-09-15T11:00:00Z', status: 'completed', questions: buildQuestions(defaultQs, 10), overallReport: mockReport(42), sessionDuration: 1440, notes: 'Baseline screening.', createdAt: '2025-09-15T11:00:00Z', completedAt: '2025-09-15T11:24:00Z' },
];
