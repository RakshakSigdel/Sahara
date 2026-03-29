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

const REPORTS_COLLECTION = "reports";

/**
 * Create a new report
 * @param {Object} reportData - Report information
 * @returns {Promise<string>} Document ID of the created report
 */
export async function createReport(reportData) {
  try {
    const docRef = await addDoc(collection(db, REPORTS_COLLECTION), {
      ...reportData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating report:", error);
    throw error;
  }
}

/**
 * Get a single report by ID
 * @param {string} reportId - Report ID
 * @returns {Promise<Object>} Report data with ID
 */
export async function getReport(reportId) {
  try {
    const docRef = doc(db, REPORTS_COLLECTION, reportId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching report:", error);
    throw error;
  }
}

/**
 * Get all reports for a specific patient
 * @param {string} patientId - Patient ID
 * @returns {Promise<Array>} Array of report data
 */
export async function getReportsByPatient(patientId) {
  try {
    const q = query(
      collection(db, REPORTS_COLLECTION),
      where("patientId", "==", patientId),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching patient reports:", error);
    throw error;
  }
}

/**
 * Get all reports for a specific doctor
 * @param {string} doctorId - Doctor ID
 * @returns {Promise<Array>} Array of report data
 */
export async function getReportsByDoctor(doctorId) {
  try {
    const q = query(
      collection(db, REPORTS_COLLECTION),
      where("doctorId", "==", doctorId),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching doctor reports:", error);
    throw error;
  }
}

/**
 * Get all reports
 * @returns {Promise<Array>} Array of all reports
 */
export async function getAllReports() {
  try {
    const q = query(
      collection(db, REPORTS_COLLECTION),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching all reports:", error);
    throw error;
  }
}

/**
 * Get reports by risk level
 * @param {string} riskLevel - Risk level (healthy, mild-concern, high-risk)
 * @returns {Promise<Array>} Array of reports with that risk level
 */
export async function getReportsByRiskLevel(riskLevel) {
  try {
    const q = query(
      collection(db, REPORTS_COLLECTION),
      where("classification", "==", riskLevel),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching reports by risk level:", error);
    throw error;
  }
}

/**
 * Update a report
 * @param {string} reportId - Report ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<void>}
 */
export async function updateReport(reportId, updateData) {
  try {
    const docRef = doc(db, REPORTS_COLLECTION, reportId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating report:", error);
    throw error;
  }
}

/**
 * Delete a report
 * @param {string} reportId - Report ID
 * @returns {Promise<void>}
 */
export async function deleteReport(reportId) {
  try {
    await deleteDoc(doc(db, REPORTS_COLLECTION, reportId));
  } catch (error) {
    console.error("Error deleting report:", error);
    throw error;
  }
}
