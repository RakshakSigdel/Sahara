/**
 * @typedef {Object} Doctor
 * @property {string} id
 * @property {string} email
 * @property {string} fullName
 * @property {string} specialty
 * @property {string} license
 * @property {string} hospital
 * @property {string} phone
 * @property {string|null} profileImage
 * @property {string} createdAt
 * @property {DoctorSettings} settings
 */

/**
 * @typedef {Object} DoctorSettings
 * @property {string[]} defaultQuestionSet - IDs of default questions
 * @property {number} sessionDuration - Max session duration in minutes
 * @property {number} autoSaveInterval - Auto-save interval in seconds
 */

/**
 * @typedef {Object} Patient
 * @property {string} id
 * @property {string} doctorId
 * @property {string} fullName
 * @property {string} dateOfBirth
 * @property {'male'|'female'|'other'} gender
 * @property {string} phone
 * @property {string} [email]
 * @property {EmergencyContact} emergencyContact
 * @property {string} medicalHistory
 * @property {string} notes
 * @property {string} addedDate
 * @property {string|null} lastSessionDate
 * @property {number} totalSessions
 */

/**
 * @typedef {Object} EmergencyContact
 * @property {string} name
 * @property {string} phone
 * @property {string} relationship
 */

/**
 * @typedef {Object} Session
 * @property {string} id
 * @property {string} patientId
 * @property {string} doctorId
 * @property {string} sessionDate
 * @property {'in-progress'|'completed'|'interrupted'} status
 * @property {SessionQuestion[]} questions
 * @property {SessionReport|null} overallReport
 * @property {number} sessionDuration - Total time in seconds
 * @property {string} notes
 * @property {string} createdAt
 * @property {string|null} completedAt
 */

/**
 * @typedef {Object} SessionQuestion
 * @property {string} id
 * @property {string} questionText
 * @property {number} order
 * @property {string|null} audioRecordingUrl
 * @property {number} duration - Recording length in seconds
 * @property {'pending'|'recording'|'uploaded'|'analyzed'} status
 * @property {QuestionAnalysis|null} analysis
 * @property {string|null} recordedAt
 */

/**
 * @typedef {Object} QuestionAnalysis
 * @property {number} speechRate - Words per minute
 * @property {number} pauseDuration - Average pause in seconds
 * @property {number} fillerWords - Count
 * @property {number} coherenceScore - 0-100
 * @property {'positive'|'neutral'|'negative'} sentiment
 * @property {number} confidence - 0-1
 */

/**
 * @typedef {Object} SessionReport
 * @property {number} riskScore - 0-100
 * @property {'healthy'|'mild-concern'|'high-risk'} classification
 * @property {VoiceMarker[]} voiceMarkers
 * @property {string[]} recommendations
 * @property {string} generatedAt
 */

/**
 * @typedef {Object} VoiceMarker
 * @property {string} name
 * @property {string} value
 * @property {string} status
 * @property {string} reference
 */

/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {'memory'|'cognition'|'language'|'orientation'} category
 * @property {string} questionText
 * @property {number} expectedDuration - Seconds
 * @property {'easy'|'medium'|'hard'} difficulty
 * @property {boolean} isDefault
 * @property {number} usageCount
 */

// Export empty objects as runtime references (JSDoc handles typing)
export const ModelSchemas = {
  Doctor: 'Doctor',
  Patient: 'Patient',
  Session: 'Session',
  Question: 'Question',
};
