// Firebase client configuration for garmentsdb-eaf13
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBqnc4xCMNCyK4APCle0UPAbXXreSCz_bw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "garmentsdb-eaf13.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://garmentsdb-eaf13-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "garmentsdb-eaf13",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "garmentsdb-eaf13.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "94470777171",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:94470777171:web:f44af5357addadc1a559a6"
};

// Initialize Firebase once
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const firebaseAuth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({ prompt: 'select_account' });

export {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
};
export type { FirebaseUser };
