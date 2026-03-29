import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";

const SESSIONS_COLLECTION = "sessions";

function sortByDateDesc(items, field) {
  const valueOf = (val) => {
    if (!val) return 0;
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const parsed = Date.parse(val);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    if (typeof val.toMillis === "function") return val.toMillis();
    if (typeof val.toDate === "function") return val.toDate().getTime();
    return 0;
  };
  return items.sort((a, b) => valueOf(b[field]) - valueOf(a[field]));
}

/**
 * Create a new session
 * @param {Object} sessionData - Session information
 * @returns {Promise<string>} Document ID of the created session
 */
export async function createSession(sessionData) {
  try {
    const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), {
      ...sessionData,
      status: "active",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
}

/**
 * Get a single session by ID
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Session data with ID
 */
export async function getSession(sessionId) {
  try {
    const docRef = doc(db, SESSIONS_COLLECTION, sessionId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching session:", error);
    throw error;
  }
}

/**
 * Get all sessions for a specific patient
 * @param {string} patientId - Patient ID
 * @returns {Promise<Array>} Array of session data
 */
export async function getSessionsByPatient(patientId) {
  try {
    const q = query(
      collection(db, SESSIONS_COLLECTION),
      where("patientId", "==", patientId),
    );
    const querySnapshot = await getDocs(q);
    const sessions = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return sortByDateDesc(sessions, "sessionDate");
  } catch (error) {
    console.error("Error fetching patient sessions:", error);
    throw error;
  }
}

/**
 * Get all sessions for a specific doctor
 * @param {string} doctorId - Doctor ID
 * @returns {Promise<Array>} Array of session data
 */
export async function getSessionsByDoctor(doctorId) {
  try {
    const q = query(
      collection(db, SESSIONS_COLLECTION),
      where("doctorId", "==", doctorId),
    );
    const querySnapshot = await getDocs(q);
    const sessions = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return sortByDateDesc(sessions, "sessionDate");
  } catch (error) {
    console.error("Error fetching doctor sessions:", error);
    throw error;
  }
}

/**
 * Get all sessions
 * @returns {Promise<Array>} Array of all sessions
 */
export async function getAllSessions() {
  try {
    const q = query(
      collection(db, SESSIONS_COLLECTION),
      orderBy("sessionDate", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching all sessions:", error);
    throw error;
  }
}

/**
 * Get sessions by status
 * @param {string} status - Session status (active, completed, interrupted)
 * @returns {Promise<Array>} Array of sessions with that status
 */
export async function getSessionsByStatus(status) {
  try {
    const q = query(
      collection(db, SESSIONS_COLLECTION),
      where("status", "==", status),
    );
    const querySnapshot = await getDocs(q);
    const sessions = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return sortByDateDesc(sessions, "sessionDate");
  } catch (error) {
    console.error("Error fetching sessions by status:", error);
    throw error;
  }
}

/**
 * Update a session
 * @param {string} sessionId - Session ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<void>}
 */
export async function updateSession(sessionId, updateData) {
  try {
    const docRef = doc(db, SESSIONS_COLLECTION, sessionId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating session:", error);
    throw error;
  }
}

/**
 * Mark session as completed with final report
 * @param {string} sessionId - Session ID
 * @param {Object} reportData - Final report data
 * @returns {Promise<void>}
 */
export async function completeSession(sessionId, reportData) {
  try {
    const docRef = doc(db, SESSIONS_COLLECTION, sessionId);
    await updateDoc(docRef, {
      status: "completed",
      overallReport: reportData,
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error completing session:", error);
    throw error;
  }
}

/**
 * Delete a session
 * @param {string} sessionId - Session ID
 * @returns {Promise<void>}
 */
export async function deleteSession(sessionId) {
  try {
    await deleteDoc(doc(db, SESSIONS_COLLECTION, sessionId));
  } catch (error) {
    console.error("Error deleting session:", error);
    throw error;
  }
}
