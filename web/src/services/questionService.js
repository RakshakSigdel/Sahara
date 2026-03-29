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

const QUESTIONS_COLLECTION = "questions";

/**
 * Create a new question
 * @param {Object} questionData - Question information
 * @returns {Promise<string>} Document ID of the created question
 */
export async function createQuestion(questionData) {
  try {
    const docRef = await addDoc(collection(db, QUESTIONS_COLLECTION), {
      ...questionData,
      usageCount: 0,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating question:", error);
    throw error;
  }
}

/**
 * Get a single question by ID
 * @param {string} questionId - Question ID
 * @returns {Promise<Object>} Question data with ID
 */
export async function getQuestion(questionId) {
  try {
    const docRef = doc(db, QUESTIONS_COLLECTION, questionId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching question:", error);
    throw error;
  }
}

/**
 * Get all questions
 * @returns {Promise<Array>} Array of all questions
 */
export async function getAllQuestions() {
  try {
    const querySnapshot = await getDocs(collection(db, QUESTIONS_COLLECTION));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching all questions:", error);
    throw error;
  }
}

/**
 * Get questions by category
 * @param {string} category - Question category
 * @returns {Promise<Array>} Array of questions in that category
 */
export async function getQuestionsByCategory(category) {
  try {
    const q = query(
      collection(db, QUESTIONS_COLLECTION),
      where("category", "==", category),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching questions by category:", error);
    throw error;
  }
}

/**
 * Get default questions for screening
 * @returns {Promise<Array>} Array of default questions
 */
export async function getDefaultQuestions() {
  try {
    const q = query(
      collection(db, QUESTIONS_COLLECTION),
      where("isDefault", "==", true),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching default questions:", error);
    throw error;
  }
}

/**
 * Update a question
 * @param {string} questionId - Question ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<void>}
 */
export async function updateQuestion(questionId, updateData) {
  try {
    const docRef = doc(db, QUESTIONS_COLLECTION, questionId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
}

/**
 * Delete a question
 * @param {string} questionId - Question ID
 * @returns {Promise<void>}
 */
export async function deleteQuestion(questionId) {
  try {
    await deleteDoc(doc(db, QUESTIONS_COLLECTION, questionId));
  } catch (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
}

/**
 * Increment question usage count
 * @param {string} questionId - Question ID
 * @returns {Promise<void>}
 */
export async function incrementQuestionUsage(questionId) {
  try {
    const docRef = doc(db, QUESTIONS_COLLECTION, questionId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const currentCount = docSnap.data().usageCount || 0;
      await updateDoc(docRef, {
        usageCount: currentCount + 1,
      });
    }
  } catch (error) {
    console.error("Error incrementing question usage:", error);
    throw error;
  }
}
