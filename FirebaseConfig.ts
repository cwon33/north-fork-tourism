// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4KUrD-rgQTXSmsqlVCtm1srvb_PYYAak",
  authDomain: "north-fork-tourism-fdf6a.firebaseapp.com",
  projectId: "north-fork-tourism-fdf6a",
  storageBucket: "north-fork-tourism-fdf6a.firebasestorage.app",
  messagingSenderId: "1020241594344",
  appId: "1:1020241594344:web:bc9063d74686b01ba4465d",
  measurementId: "G-BDDQ4BBGLE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app,{
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);
export const storage = getStorage(app);