import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, addDoc, query, onSnapshot, serverTimestamp, updateDoc, doc, deleteDoc, increment } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// তোমার Firebase কনফিগারেশন
const firebaseConfig = {
    apiKey: "AIzaSyB_xkcJ87-E4jkYIDT2dBxOFJHUQvZxbU8",
    authDomain: "myblogcomments-22808.firebaseapp.com",
    projectId: "myblogcomments-22808",
    storageBucket: "myblogcomments-22808.firebasestorage.app",
    messagingSenderId: "1067155293144",
    appId: "1:1067155293144:web:8f10b016462b52d36628ad"
};

// Firebase ইনিশিয়ালাইজ করা
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// বাকি লজিক এখানে থাকবে...
