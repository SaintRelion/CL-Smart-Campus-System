import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-NJV6IuCqV_wyHpUFHlvtwqEBLMXBtFE",
  authDomain: "ojt-attendance-system-3ec21.firebaseapp.com",
  projectId: "ojt-attendance-system-3ec21",
  storageBucket: "ojt-attendance-system-3ec21.firebasestorage.app",
  messagingSenderId: "931813739421",
  appId: "1:931813739421:web:e14053362b8efcd3e9bd74",
  measurementId: "G-EVCP5V984B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
