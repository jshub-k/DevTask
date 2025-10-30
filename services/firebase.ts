
// FIX: Switched to Firebase v8 compat imports to address module resolution error with 'initializeApp'.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// IMPORTANT:
// Replace this with your own Firebase project configuration.
// You can find this in your Firebase project settings.
const firebaseConfig = {
  apiKey: "AIzaSyBunrPaHiise9jZp3MNweZHJIYMSNiXWHo",
  authDomain: "jsrhub-912b1.firebaseapp.com",
  databaseURL: "https://jsrhub-912b1-default-rtdb.firebaseio.com",
  projectId: "jsrhub-912b1",
  storageBucket: "jsrhub-912b1.firebasestorage.app",
  messagingSenderId: "715140211633",
  appId: "1:715140211633:web:4dd91a940cc6faa0d81390"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();
// FIX: Export serverTimestamp for use in other components with the v8 compat API.
const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

export { app, auth, db, googleProvider, serverTimestamp };
