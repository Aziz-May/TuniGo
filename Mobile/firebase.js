import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDjXyt4mZTZbiMGTPqJCuK4NMS6me67V8Q",
    authDomain: "tunigo1.firebaseapp.com",
    projectId: "tunigo1",
    storageBucket: "tunigo1.firebasestorage.app",
    messagingSenderId: "719814108122",
    appId: "1:719814108122:web:fb752bbc8ce4f63000d6e3",
    measurementId: "G-MPJ2P6195F"
  };
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const analytics = getAnalytics(app);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);

export {  firestore, auth };
