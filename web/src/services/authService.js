import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser as deleteFirebaseUser,
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
      role: "doctor",
      approvalStatus: "approved",
      ...userData,
    });

    return authUser;
  } catch (error) {
    console.error("Auth register error:", error.code, error.message);
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
    console.error("Auth login error:", error.code, error.message);
    throw error;
  }
}

/**
 * Sign out the current Firebase auth user
 * @returns {Promise<void>}
 */
export function logout() {
  return signOut(auth);
}

/**
 * Send a password reset email
 * @param {string} email - User email address
 * @returns {Promise<void>}
 * @throws {Error} If sending fails (e.g. user not found)
 */
export async function sendResetEmail(email) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Auth sendResetEmail error:", error.code, error.message);
    throw error;
  }
}

/**
 * Confirm a password reset using the oob code from the email link
 * @param {string} oobCode - The out-of-band code from the reset link
 * @param {string} newPassword - The new password
 * @returns {Promise<void>}
 * @throws {Error} If reset fails (expired / invalid code)
 */
export async function resetPassword(oobCode, newPassword) {
  try {
    await confirmPasswordReset(auth, oobCode, newPassword);
  } catch (error) {
    console.error("Auth resetPassword error:", error.code, error.message);
    throw error;
  }
}

/**
 * Change the current user's password (requires recent sign-in)
 * @param {string} currentPassword - The user's current password for re-auth
 * @param {string} newPassword - The new password
 * @returns {Promise<void>}
 * @throws {Error} If update fails
 */
export async function changePassword(currentPassword, newPassword) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    // Re-authenticate first
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);
  } catch (error) {
    console.error("Auth changePassword error:", error.code, error.message);
    throw error;
  }
}

/**
 * Re-authenticate the current user (for sensitive operations)
 * @param {string} password - The user's current password
 * @returns {Promise<void>}
 * @throws {Error} If re-auth fails
 */
export async function reauthenticate(password) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  } catch (error) {
    console.error("Auth reauthenticate error:", error.code, error.message);
    throw error;
  }
}

/**
 * Delete the current Firebase Auth user account
 * Note: Firestore user doc should be deleted separately via userService
 * @returns {Promise<void>}
 * @throws {Error} If deletion fails (may require recent sign-in)
 */
export async function deleteAccount() {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");
    await deleteFirebaseUser(user);
  } catch (error) {
    console.error("Auth deleteAccount error:", error.code, error.message);
    throw error;
  }
}
