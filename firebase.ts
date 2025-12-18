
// Fix: Use namespace imports to resolve "no exported member" errors in some build environments
import * as firebaseApp from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import * as firebaseFirestore from 'firebase/firestore';

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
  // Fix: Access methods through namespace objects to satisfy strict export checks
  const app = firebaseApp.initializeApp(firebaseConfig);
  auth = firebaseAuth.getAuth(app);
  db = firebaseFirestore.getFirestore(app);
  console.log("Firebase 服務啟動成功 (Modular 模式)");
} catch (error) {
  console.error("Firebase 初始化失敗:", error);
  isOffline = true;
}

// 供元件使用的 Shim 介面
export const onAuthStateChanged = (authObj: any, callback: any) => firebaseAuth.onAuthStateChanged(authObj, callback);
export const signOut = (authObj: any) => firebaseAuth.signOut(authObj);
export const signInWithEmailAndPassword = (authObj: any, email: string, pass: string) => firebaseAuth.signInWithEmailAndPassword(authObj, email, pass);
export const createUserWithEmailAndPassword = (authObj: any, email: string, pass: string) => firebaseAuth.createUserWithEmailAndPassword(authObj, email, pass);

export const collection = (dbObj: any, path: string) => firebaseFirestore.collection(dbObj, path);
export const doc = (dbOrCol: any, pathOrId: string, id?: string) => {
  if (id) return firebaseFirestore.doc(firebaseFirestore.collection(db, pathOrId), id);
  return firebaseFirestore.doc(dbOrCol, pathOrId, id as string);
};
export const getDoc = (docRef: any) => firebaseFirestore.getDoc(docRef);
export const addDoc = (colRef: any, data: any) => firebaseFirestore.addDoc(colRef, data);
export const updateDoc = (docRef: any, data: any) => firebaseFirestore.updateDoc(docRef, data);
export const deleteDoc = (docRef: any) => firebaseFirestore.deleteDoc(docRef);
export const query = (ref: any, ...constraints: any[]) => firebaseFirestore.query(ref, ...constraints);
export const where = (field: string, op: any, val: any) => firebaseFirestore.where(field, op, val);
export const onSnapshot = (ref: any, callback: any) => firebaseFirestore.onSnapshot(ref, callback);

export { auth, db, isOffline };
