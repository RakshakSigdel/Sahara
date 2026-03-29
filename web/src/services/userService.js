import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

const USERS_COLLECTION = "users";

/**
 * Create a new user document (called after auth user is created)
 * @param {string} uid - Firebase Auth UID
 * @param {Object} profileData - User profile information
 * @returns {Promise<void>}
 */
export async function createUser(uid, profileData) {
  const { fullName, licenseNo, hospitalName, speciality, phone, email } =
    profileData;

  try {
    await setDoc(doc(db, USERS_COLLECTION, uid), {
      uid,
      fullName,
      licenseNo,
      hospitalName,
      speciality,
      phone,
      email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

/**
 * Get all users
 * @returns {Promise<Array>} Array of all users
 */
export async function getUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

/**
 * Get a single user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object>} User data with ID
 */
export async function getUser(id) {
  try {
    const docRef = doc(db, USERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

/**
 * Update a user
 * @param {Object} updateData - Update data (must include id)
 * @returns {Promise<void>}
 */
export async function updateUser({
  id,
  email,
  fullName,
  licenseNo,
  hospitalName,
  speciality,
  phone,
}) {
  try {
    const docRef = doc(db, USERS_COLLECTION, id);
    await updateDoc(docRef, {
      email,
      fullName,
      licenseNo,
      hospitalName,
      speciality,
      phone,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise<void>}
 */
export async function deleteUser(id) {
  try {
    await deleteDoc(doc(db, USERS_COLLECTION, id));
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
