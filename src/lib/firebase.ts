
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth"; // Added social providers
// import { getFirestore, type Firestore } from "firebase/firestore";
// import { getStorage, type FirebaseStorage } from "firebase/storage";

// IMPORTANT: In a real application, these should come from environment variables
// and not be hardcoded directly in the source code for security reasons.
// Example: const firebaseConfig = { apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, ... };
const firebaseConfig = {
  apiKey: "AIzaSyDT4-R0H8uydAqzrTsHfMKLXQ59p7u67Ho",
  authDomain: "katha-vault-novel.firebaseapp.com",
  databaseURL: "https://katha-vault-novel-default-rtdb.firebaseio.com",
  projectId: "katha-vault-novel",
  storageBucket: "katha-vault-novel.firebasestorage.app",
  messagingSenderId: "1050410197456",
  appId: "1:1050410197456:web:3add67c05dac9fe2c419d5"
};

// Initialize Firebase
let app: FirebaseApp;
let authInstance: Auth; 
// let firestore: Firestore;
// let storage: FirebaseStorage;

try {
  app = initializeApp(firebaseConfig);
  authInstance = getAuth(app); 
  // firestore = getFirestore(app);
  // storage = getStorage(app);
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // Fallback or error handling if initialization fails
  // For now, we'll let errors propagate, but in a real app, you might
  // want to provide mock instances or a specific error state.
  throw new Error("Firebase initialization failed");
}

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { app, authInstance as auth, googleProvider, facebookProvider /*, firestore, storage */ };
