
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * 請將下方的 firebaseConfig 替換為您從 Firebase Console 取得的正式內容。
 * 這樣做可以確保在 GitHub Actions 執行環境之外（如本機開發）也能順利運行。
 */
const firebaseConfig = {
  apiKey: "AIzaSyDUEbLW7K_2wh5FPtIQlDOvH9fMMpNj8YA",
  authDomain: "juily-b8c26.firebaseapp.com",
  projectId: "juily-b8c26",
  storageBucket: "juily-b8c26.firebasestorage.app",
  messagingSenderId: "213594944786",
  appId: "1:213594944786:web:2d675e2c46935f4b7fafcb"
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let isOffline = false;

// 進行配置檢查
const isValidConfig = firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY";

try {
  if (isValidConfig) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase 服務啟動成功");
  } else {
    console.warn("未偵測到有效的 Firebase 設定，系統將進入展示模式。");
    isOffline = true;
  }
} catch (error) {
  console.error("Firebase 初始化失敗:", error);
  isOffline = true;
}

export { auth, db, isOffline };
