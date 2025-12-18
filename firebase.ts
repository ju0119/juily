
// Fix: Use namespace imports and cast to any to resolve "no exported member" errors in this environment
import * as FirebaseApp from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import * as FirebaseFirestore from 'firebase/firestore';

const { initializeApp } = FirebaseApp as any;
const { 
  getAuth, 
  onAuthStateChanged: firebaseOnAuthStateChanged, 
  signOut: firebaseSignOut, 
  signInWithEmailAndPassword: firebaseSignIn, 
  createUserWithEmailAndPassword: firebaseCreateUser 
} = FirebaseAuth as any;
const { 
  getFirestore, 
  collection: firebaseCollection, 
  doc: firebaseDoc, 
  getDoc: firebaseGetDoc, 
  addDoc: firebaseAddDoc, 
  updateDoc: firebaseUpdateDoc, 
  deleteDoc: firebaseDeleteDoc, 
  query: firebaseQuery, 
  where: firebaseWhere, 
  onSnapshot: firebaseOnSnapshot 
} = FirebaseFirestore as any;

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
  // Access methods directly through namespace imports to satisfy requirements
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
