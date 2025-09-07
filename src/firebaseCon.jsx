import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCi_7vON2iaQfV2PERv2m6m9YjZLNp--fM",
  authDomain: "kriya1-5fb0d.firebaseapp.com",
  projectId: "kriya1-5fb0d",
  storageBucket: "kriya1-5fb0d.appspot.com",
  messagingSenderId: "892248196632",
  appId: "1:892248196632:web:86e5a8f33dad9603eea56d",
  measurementId: "G-7LNS22RP2N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firestore=getFirestore(app);