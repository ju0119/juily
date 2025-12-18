
// Fix: Use named imports instead of namespace imports to resolve property access errors
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged as firebaseOnAuthStateChanged, 
  signOut as firebaseSignOut, 
  signInWithEmailAndPassword as firebaseSignIn, 
  createUserWithEmailAndPassword as firebaseCreateUser 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection as firebaseCollection, 
  doc as firebaseDoc, 
  getDoc as firebaseGetDoc, 
  addDoc as firebaseAddDoc, 
  updateDoc as firebaseUpdateDoc, 
  deleteDoc as firebaseDeleteDoc, 
  query as firebaseQuery, 
  where as firebaseWhere, 
  onSnapshot as firebaseOnSnapshot 
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

try {
  // Fix: Access methods directly through named imports to satisfy modular SDK requirements
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("Firebase 服務啟動成功 (Modular 模式)");
} catch (error) {
  console.error("Firebase 初始化失敗:", error);
  isOffline = true;
}

// 供元件使用的 Shim 介面
export const onAuthStateChanged = (authObj: any, callback: any) => firebaseOnAuthStateChanged(authObj, callback);
export const signOut = (authObj: any) => firebaseSignOut(authObj);
export const signInWithEmailAndPassword = (authObj: any, email: string, pass: string) => firebaseSignIn(authObj, email, pass);
export const createUserWithEmailAndPassword = (authObj: any, email: string, pass: string) => firebaseCreateUser(authObj, email, pass);

export const collection = (dbObj: any, path: string) => firebaseCollection(dbObj, path);
export const doc = (dbOrCol: any, pathOrId: string, id?: string) => {
  if (id) return firebaseDoc(firebaseCollection(db, pathOrId), id);
  return firebaseDoc(dbOrCol, pathOrId, id as string);
};
export const getDoc = (docRef: any) => firebaseGetDoc(docRef);
export const addDoc = (colRef: any, data: any) => firebaseAddDoc(colRef, data);
export const updateDoc = (docRef: any, data: any) => firebaseUpdateDoc(docRef, data);
export const deleteDoc = (docRef: any) => firebaseDeleteDoc(docRef);
export const query = (ref: any, ...constraints: any[]) => firebaseQuery(ref, ...constraints);
export const where = (field: string, op: any, val: any) => firebaseWhere(field, op, val);
export const onSnapshot = (ref: any, callback: any) => firebaseOnSnapshot(ref, callback);

export { auth, db, isOffline };
