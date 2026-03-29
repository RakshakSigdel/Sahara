import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { createUser } from "./userService";

/**
 * Register a new user with email and password
 * Creates both Firebase Auth user and Firestore user document
 * @param {string} email - User email address
 * @param {string} password - User password
 * @param {Object} userData - Additional user profile data (fullName, licenseNo, hospitalName, speciality, phone)
 * @returns {Promise<Object>} Firebase user credential
 * @throws {Error} If registration fails
 */
export async function register(email, password, userData = {}) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const authUser = userCredential.user;

    await createUser(authUser.uid, {
      email,
      ...userData,
    });

    return authUser;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);
    throw error;
  }
}

/**
 * Sign in an existing user with email and password
 * @param {string} email - User email address
 * @param {string} password - User password
 * @returns {Promise<Object>} Firebase user credential
 * @throws {Error} If login fails
 */
export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);
    throw error;
  }
}
