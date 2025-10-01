import { initializeFirebaseAuth } from "@saintrelion/auth-lib";
import { initializeFirestore } from "@saintrelion/data-access-layer";
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVgLFgh9M8ey8v5hRjSZjDN3LfAv-oV6M",
  authDomain: "c-project-s.firebaseapp.com",
  projectId: "c-project-s",
  storageBucket: "c-project-s.firebasestorage.app",
  messagingSenderId: "287832751396",
  appId: "1:287832751396:web:54f2411e12220c180547b1",
  measurementId: "G-Y1ZZ8L3T30",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

initializeFirestore(app);
initializeFirebaseAuth(app);
