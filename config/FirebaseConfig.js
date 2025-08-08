// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDtw_zO7L8xpiEzeNs_OcQ60eH_-BD99YI",
  authDomain: "a4samay.firebaseapp.com",
  projectId: "a4samay",
  storageBucket: "a4samay.firebasestorage.app",
  messagingSenderId: "450089918903",
  appId: "1:450089918903:web:e56dc17febf98a688a4832"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const FirebaseDB = getFirestore(app);
