
// Use namespace imports to work around environment issues with named exports in @firebase modules
import * as firebaseApp from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import { 
  getFirestore, 
  collection as fbCollection, 
  doc as fbDoc, 
  getDoc as fbGetDoc, 
  addDoc as fbAddDoc, 
  updateDoc as fbUpdateDoc, 
  deleteDoc as fbDeleteDoc, 
  query as fbQuery, 
  where as fbWhere, 
  onSnapshot as fbOnSnapshot 
} from 'firebase/firestore';

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

// Destructure from namespace imports to avoid "no exported member" errors during build/lint
const { initializeApp } = firebaseApp;
const { 
  getAuth, 
  onAuthStateChanged: fbOnAuthStateChanged, 
  signOut: fbSignOut, 
  signInWithEmailAndPassword: fbSignIn, 
  createUserWithEmailAndPassword: fbCreateUser 
} = firebaseAuth;

try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("Firebase 服務啟動成功 (Modular 模式)");
} catch (error) {
  console.error("Firebase 初始化失敗:", error);
  isOffline = true;
}

// 供元件使用的 Shim 介面
export const onAuthStateChanged = (authObj: any, callback: any) => fbOnAuthStateChanged(authObj, callback);
export const signOut = (authObj: any) => fbSignOut(authObj);
export const signInWithEmailAndPassword = (authObj: any, email: string, pass: string) => fbSignIn(authObj, email, pass);
export const createUserWithEmailAndPassword = (authObj: any, email: string, pass: string) => fbCreateUser(authObj, email, pass);

export const collection = (dbObj: any, path: string) => fbCollection(dbObj, path);
export const doc = (dbOrCol: any, pathOrId: string, id?: string) => {
  if (id) return fbDoc(fbCollection(db, pathOrId), id);
  // 在原本程式碼中 doc(db, 'accounts', id) 的寫法對應：
  return fbDoc(dbOrCol, pathOrId, id as string);
};
export const getDoc = (docRef: any) => fbGetDoc(docRef);
export const addDoc = (colRef: any, data: any) => fbAddDoc(colRef, data);
export const updateDoc = (docRef: any, data: any) => fbUpdateDoc(docRef, data);
export const deleteDoc = (docRef: any) => fbDeleteDoc(docRef);
export const query = (ref: any, ...constraints: any[]) => fbQuery(ref, ...constraints);
export const where = (field: string, op: any, val: any) => fbWhere(field, op, val);
export const onSnapshot = (ref: any, callback: any) => fbOnSnapshot(ref, callback);

export { auth, db, isOffline };
