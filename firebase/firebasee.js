import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyC6pV79q-SaBGvWh5DgMKTM8890OReWI80",
    authDomain: "appp-daaf0.firebaseapp.com",
    projectId: "appp-daaf0",
    storageBucket: "appp-daaf0.firebasestorage.app",
    messagingSenderId: "668650550904",
    appId: "1:668650550904:web:14af42d0ea13f75c9ddf8d",
    measurementId: "G-324NW53SBN"
  };
  

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };