// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhNgN00pFRybJMgeoMftWmZ6ouLKVlOOc",
  authDomain: "instaclone-41289.firebaseapp.com",
  projectId: "instaclone-41289",
  storageBucket: "instaclone-41289.appspot.com",
  messagingSenderId: "370204090259",
  appId: "1:370204090259:web:4b743e2925fc32bf699266",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
