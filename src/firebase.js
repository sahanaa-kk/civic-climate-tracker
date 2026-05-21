// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Replace these with actual Firebase project config later
  apiKey: "AIzaSyMockKeyForDemoPurposesOnly",
  authDomain: "civic-climate-tracker.firebaseapp.com",
  projectId: "civic-climate-tracker",
  storageBucket: "civic-climate-tracker.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
