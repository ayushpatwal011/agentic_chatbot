
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ai-chatbot-5f787.firebaseapp.com",
  projectId: "ai-chatbot-5f787",
  storageBucket: "ai-chatbot-5f787.firebasestorage.app",
  messagingSenderId: "638613748853",
  appId: "1:638613748853:web:b6a5bd93ebe6a3d234cc3c",
  measurementId: "G-W21NHWS6ZC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(auth)