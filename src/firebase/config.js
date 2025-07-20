import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnrPvHzL9RZzXFMZLn5_ZEMOT5_pW9aqA",
  authDomain: "vaultx-e4dd6.firebaseapp.com",
  projectId: "vaultx-e4dd6",
  storageBucket: "vaultx-e4dd6.firebasestorage.app",
  messagingSenderId: "418614694446",
  appId: "1:418614694446:web:a4abc1cb91ccaab10b05bf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {collection, db, auth, provider, signInWithPopup,  addDoc };
