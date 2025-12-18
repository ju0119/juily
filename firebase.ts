
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

/**
 * Firebase 配置已依要求直接寫入程式碼。
 * 使用 compat 版本以支援舊版環境並提供模組化 Shim。
 */
const firebaseConfig = {
  apiKey: "AIzaSyDUEbLW7K_2wh5FPtIQlDOvH9fMMpNj8YA",
  authDomain: "juily-b8c26.firebaseapp.com",
  projectId: "juily-b8c26",
  storageBucket: "juily-b8c26.firebasestorage.app",
  messagingSenderId: "213594944786",
  appId: "1:213594944786:web:2d675e2c46935f4b7fafcb"
};

let auth: any = null;
let db: any = null;
let isOffline = false;

try {
  const app = firebase.initializeApp(firebaseConfig);
  auth = app.auth();
  db = app.firestore();
  console.log("Firebase 服務啟動成功 (Compat 模式)");
} catch (error) {
  console.error("Firebase 初始化失敗:", error);
  isOffline = true;
}

// Firebase 模組化 API Shim
export const onAuthStateChanged = (auth: any, callback: any) => auth.onAuthStateChanged(callback);
export const signOut = (auth: any) => auth.signOut();
export const signInWithEmailAndPassword = (auth: any, email: any, pass: any) => auth.signInWithEmailAndPassword(email, pass);
export const createUserWithEmailAndPassword = (auth: any, email: any, pass: any) => auth.createUserWithEmailAndPassword(email, pass);

export const collection = (db: any, path: string) => db.collection(path);
export const doc = (dbOrCol: any, pathOrId: string, id?: string) => {
  if (id) return dbOrCol.collection(pathOrId).doc(id);
  return typeof dbOrCol.doc === 'function' ? dbOrCol.doc(pathOrId) : dbOrCol.collection(pathOrId);
};
export const getDoc = (docRef: any) => docRef.get();
export const addDoc = (colRef: any, data: any) => colRef.add(data);
export const updateDoc = (docRef: any, data: any) => docRef.update(data);
export const deleteDoc = (docRef: any) => docRef.delete();
export const query = (ref: any, ...constraints: any[]) => constraints.reduce((acc, c) => c(acc), ref);
export const where = (field: string, op: any, val: any) => (ref: any) => ref.where(field, op, val);
export const onSnapshot = (ref: any, callback: any) => ref.onSnapshot(callback);

export { auth, db, isOffline };
