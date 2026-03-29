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
} from "firebase/firestore";

const PATIENTS_COLLECTION = "patients";

/**
 * Create a new patient
 * @param {Object} patientData - Patient information
 * @returns {Promise<string>} Document ID of the created patient
 */
export async function createPatient(patientData) {
  try {
    const docRef = await addDoc(collection(db, PATIENTS_COLLECTION), {
      ...patientData,
      createdAt: serverTimestamp(),
      totalSessions: 0,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating patient:", error);
    throw error;
  }
}

/**
 * Get a single patient by ID
 * @param {string} patientId - Patient ID
 * @returns {Promise<Object>} Patient data with ID
 */
export async function getPatient(patientId) {
  try {
    const docRef = doc(db, PATIENTS_COLLECTION, patientId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching patient:", error);
    throw error;
  }
}

/**
 * Get all patients for a specific doctor
 * @param {string} doctorId - Doctor ID
 * @returns {Promise<Array>} Array of patient data
 */
export async function getPatientsByDoctor(doctorId) {
  try {
    const q = query(
      collection(db, PATIENTS_COLLECTION),
      where("doctorId", "==", doctorId),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }
}

/**
 * Get all patients
 * @returns {Promise<Array>} Array of all patient data
 */
export async function getAllPatients() {
  try {
    const querySnapshot = await getDocs(collection(db, PATIENTS_COLLECTION));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching all patients:", error);
    throw error;
  }
}

/**
 * Update a patient
 * @param {string} patientId - Patient ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<void>}
 */
export async function updatePatient(patientId, updateData) {
  try {
    const docRef = doc(db, PATIENTS_COLLECTION, patientId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    throw error;
  }
}

/**
 * Delete a patient
 * @param {string} patientId - Patient ID
 * @returns {Promise<void>}
 */
export async function deletePatient(patientId) {
  try {
    await deleteDoc(doc(db, PATIENTS_COLLECTION, patientId));
  } catch (error) {
    console.error("Error deleting patient:", error);
    throw error;
  }
}

/**
 * Increment patient session count
 * @param {string} patientId - Patient ID
 * @returns {Promise<void>}
 */
export async function incrementPatientSessionCount(patientId) {
  try {
    const docRef = doc(db, PATIENTS_COLLECTION, patientId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const currentCount = docSnap.data().totalSessions || 0;
      await updateDoc(docRef, {
        totalSessions: currentCount + 1,
        lastSessionDate: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error incrementing session count:", error);
    throw error;
  }
}
