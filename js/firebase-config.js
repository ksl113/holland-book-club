import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBp1WFEo9UOpDeAJ4BJQzenmnYZJ8Ebq54",
  authDomain: "holland-family-book-discussion.firebaseapp.com",
  projectId: "holland-family-book-discussion",
  storageBucket: "holland-family-book-discussion.firebasestorage.app",
  messagingSenderId: "866222918096",
  appId: "1:866222918096:web:9d2df6ecdca3996a1751d5"
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export the database
export { db };
