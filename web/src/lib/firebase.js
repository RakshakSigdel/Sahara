import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdkISAP5ShMX0Fn5RqGjFV8H0h8-qdDX4",
  authDomain: "nln-hackathon.firebaseapp.com",
  projectId: "nln-hackathon",
  storageBucket: "nln-hackathon.firebasestorage.app",
  messagingSenderId: "314477164505",
  appId: "1:314477164505:web:0cac8b0014965c23a54bc8",
  measurementId: "G-2PBCT90EWJ",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export default app;

export { auth, db };
