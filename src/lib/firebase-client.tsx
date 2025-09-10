import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "REMOVED_FIREBASE_API_KEY_2",
  authDomain: "REMOVED_FIREBASE_AUTH_DOMAIN_2",
  projectId: "REMOVED_FIREBASE_PROJECT_ID_2",
  storageBucket: "REMOVED_FIREBASE_PROJECT_ID_2.firebasestorage.app",
  messagingSenderId: "REMOVED_FIREBASE_MESSAGING_SENDER_ID_2",
  appId: "REMOVED_FIREBASE_APP_ID_2",
  measurementId: "REMOVED_FIREBASE_MEASUREMENT_ID_1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
