import * as firebase from "firebase/app";
import "firebase/auth";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import "firebase/storage";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export const db = getFirestore();
export const storage = getStorage();
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
