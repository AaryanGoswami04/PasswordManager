import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// 👇 1. IMPORT the functions you need from Firestore here
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4gcHm-1SLThcie_aTI2k3BF2CaewOxIU",
  authDomain: "cybersecurity-e33bc.firebaseapp.com",
  projectId: "cybersecurity-e33bc",
  storageBucket: "cybersecurity-e33bc.firebasestorage.app",
  messagingSenderId: "948318880091",
  appId: "1:948318880091:web:07a5f48a79a50edc251a7e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 👇 2. EXPORT the functions so other files can import them
export {
    db,
    auth,
    provider,
    signInWithPopup,
    collection,
    addDoc,
    doc,
    getDoc,
    updateDoc
};
