import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB-VnAlchs6u_9B32t6kKkmsyC41vVnhIk",
  authDomain: "hostee2.firebaseapp.com",
  projectId: "hostee2",
  storageBucket: "hostee2.firebasestorage.app",
  messagingSenderId: "674086125130",
  appId: "1:674086125130:web:6442e363112039bd8b70b3",
  measurementId: "G-HF5S3MLVV6"

};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
