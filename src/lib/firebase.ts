
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
  storageBucket: "katha-vault-novel.appspot.com", // Corrected: typically .appspot.com
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

  // Initialize App Check
  // This should only be initialized on the client
  if (typeof window !== 'undefined') {
    console.log("Attempting to initialize Firebase App Check...");

    // IMPORTANT: Replace 'YOUR_RECAPTCHA_V3_SITE_KEY_HERE' with your actual reCAPTCHA v3 site key.
    // This key is obtained from your Google Cloud Console under reCAPTCHA Enterprise.
    // Your domain (e.g., localhost or your cloud workstation domain) MUST be whitelisted
    // in the reCAPTCHA settings for this key.
    // Also, ensure App Check is enabled for Authentication in your Firebase project console.
    const reCaptchaSiteKey = 'YOUR_RECAPTCHA_V3_SITE_KEY_HERE';

    if (reCaptchaSiteKey === 'YOUR_RECAPTCHA_V3_SITE_KEY_HERE') {
      console.warn(
        "Firebase App Check: CRITICAL - Placeholder reCAPTCHA v3 site key is being used. " +
        "App Check WILL FAIL. Please replace 'YOUR_RECAPTCHA_V3_SITE_KEY_HERE' " +
        "in src/lib/firebase.ts with your actual site key from Google Cloud Console."
      );
    } else {
      console.log("Firebase App Check: Using provided reCAPTCHA v3 site key.");
    }
    
    // Debug: To use a debug token in development (generate one from Firebase Console -> App Check -> Apps -> Your App -> Manage debug tokens)
    // (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = "YOUR_DEBUG_TOKEN_IF_NEEDED"; // Uncomment and replace if using a debug token

    appCheckInstance = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(reCaptchaSiteKey),
      isTokenAutoRefreshEnabled: true // Optional: automatically refresh App Check token as needed
    });
    console.log("Firebase App Check initialization attempted.");
  } else {
    console.log("Skipping Firebase App Check initialization (server-side).");
  }

} catch (error) {
  console.error("Error initializing Firebase or App Check:", error);
  // Fallback or error handling if initialization fails
  throw new Error("Firebase/AppCheck initialization failed");
}

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { app, authInstance as auth, googleProvider, facebookProvider, appCheckInstance };
