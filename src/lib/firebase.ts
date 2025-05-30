
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider, type AppCheck } from "firebase/app-check";

// IMPORTANT: In a real application, these should come from environment variables
// and not be hardcoded directly in the source code for security reasons.
// Example: const firebaseConfig = { apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, ... };
const firebaseConfig = {
  apiKey: "AIzaSyDT4-R0H8uydAqzrTsHfMKLXQ59p7u67Ho",
  authDomain: "katha-vault-novel.firebaseapp.com",
  databaseURL: "https://katha-vault-novel-default-rtdb.firebaseio.com",
  projectId: "katha-vault-novel",
  storageBucket: "katha-vault-novel.appspot.com", // Corrected
  messagingSenderId: "1050410197456",
  appId: "1:1050410197456:web:3add67c05dac9fe2c419d5"
};

// Initialize Firebase
let app: FirebaseApp;
let authInstance: Auth;
let appCheckInstance: AppCheck | undefined;

try {
  app = initializeApp(firebaseConfig);
  authInstance = getAuth(app);

  // Initialize App Check - This should only be initialized on the client
  if (typeof window !== 'undefined') {
    console.log("Firebase App Check: Client-side environment detected. Attempting to initialize...");

    // --- TEMPORARY DEBUGGING FOR APP CHECK ---
    // IMPORTANT: Set to true for local development if reCAPTCHA v3 is problematic,
    // OR set to your actual debug token string obtained from the Firebase console.
    // REMOVE OR SET TO FALSE for production.
    console.log("Firebase App Check: Enabling DEBUG TOKEN MODE. This is for local development only.");
    (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true; 
    // --- END TEMPORARY DEBUGGING ---

    // IMPORTANT: Replace 'YOUR_RECAPTCHA_V3_SITE_KEY_HERE' with your actual reCAPTCHA v3 site key.
    // This key is obtained from your Google Cloud Console under reCAPTCHA Enterprise.
    // Your domain (e.g., localhost or your cloud workstation domain) MUST be whitelisted
    // in the reCAPTCHA settings for this key.
    // Also, ensure App Check is enabled for Authentication in your Firebase project console.
    const reCaptchaSiteKey = 'YOUR_RECAPTCHA_V3_SITE_KEY_HERE';

    if (reCaptchaSiteKey === 'YOUR_RECAPTCHA_V3_SITE_KEY_HERE' && !(window as any).FIREBASE_APPCHECK_DEBUG_TOKEN) {
      console.warn(
        "Firebase App Check: CRITICAL - Placeholder reCAPTCHA v3 site key is being used, and debug token is not active. " +
        "App Check WILL FAIL. Please replace 'YOUR_RECAPTCHA_V3_SITE_KEY_HERE' " +
        "in src/lib/firebase.ts with your actual site key from Google Cloud Console, or ensure debug token is correctly set for local testing."
      );
    } else if (!(window as any).FIREBASE_APPCHECK_DEBUG_TOKEN) {
      console.log("Firebase App Check: Using provided reCAPTCHA v3 site key for provider.");
    }
    
    appCheckInstance = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(reCaptchaSiteKey), // This key is only used if debug token is not set/false
      isTokenAutoRefreshEnabled: true
    });
    console.log("Firebase App Check: Initialization call completed.");
  } else {
    console.log("Firebase App Check: Skipping initialization (server-side or non-browser environment).");
  }

} catch (error) {
  console.error("Error initializing Firebase or App Check:", error);
  // Fallback or error handling if initialization fails
  // In a real app, you might want to notify the user or disable features that depend on Firebase.
  // For this prototype, we'll re-throw to make the issue visible during development.
  throw new Error("Firebase/AppCheck initialization failed. Check console for details.");
}

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { app, authInstance as auth, googleProvider, facebookProvider, appCheckInstance };
