import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBImFnqwTbzZ9xPT9g-7Lw7_F1QVM9Q6vQ",
  authDomain: "chat-database-46f99.firebaseapp.com",
  projectId: "chat-database-46f99",
  storageBucket: "chat-database-46f99.appspot.com",
  messagingSenderId: "259765787507",
  appId: "1:259765787507:web:daa3346d5f0166104e0306",
  measurementId: "G-DZCP178EGK",
};

const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);
export const auth = getAuth(app);

// Analytics (safe)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { analytics };
