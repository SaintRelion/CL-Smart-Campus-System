import { initializeFirebaseAuth } from "@saintrelion/auth-lib";
import { initializeFirestore } from "@saintrelion/data-access-layer";
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "REMOVED_FIREBASE_API_KEY_1",
  authDomain: "REMOVED_FIREBASE_AUTH_DOMAIN_1",
  projectId: "REMOVED_FIREBASE_PROJECT_ID_1",
  storageBucket: "REMOVED_FIREBASE_PROJECT_ID_1.firebasestorage.app",
  messagingSenderId: "REMOVED_FIREBASE_MESSAGING_SENDER_ID_1",
  appId: "REMOVED_FIREBASE_APP_ID_1",
  measurementId: "REMOVED_FIREBASE_MEASUREMENT_ID_2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

initializeFirestore(app);
initializeFirebaseAuth(app);
