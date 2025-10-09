import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCVktf68MBH2AX5VI5F9hnoSLHYL6A9u30",
  authDomain: "vitrine-app-d9b0b.firebaseapp.com",
  projectId: "vitrine-app-d9b0b",
  storageBucket: "vitrine-app-d9b0b.firebasestorage.app",
  messagingSenderId: "155310371055",
  appId: "1:155310371055:web:6f64d19175f096bd606b1a"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
