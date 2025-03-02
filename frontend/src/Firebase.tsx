import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbYfvFfWUcVcyWAGmr_89ZsBpmPswYkAE",
  authDomain: "ahrs-23fc6.firebaseapp.com",
  projectId: "ahrs-23fc6",
  storageBucket: "ahrs-23fc6.appspot.com", // ✅ Fixed storage bucket
  messagingSenderId: "843175549",
  appId: "1:843175549:web:7847acf830f288976c8314",
  measurementId: "G-FZ80PCH7TS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage, analytics };
