
import { initializeApp, FirebaseApp } from 'firebase/app';
// Fix: Separate type and value imports to resolve module export issues
import { getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let isOffline = false;

try {
  const configStr = process.env.FIREBASE_CONFIG;
  const config = JSON.parse(configStr || '{}');

  if (config.apiKey) {
    app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully");
  } else {
    console.warn("Firebase configuration missing. Running in demo/offline mode.");
    isOffline = true;
  }
} catch (error) {
  console.error("Failed to initialize Firebase:", error);
  isOffline = true;
}

export { auth, db, isOffline };
