import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB_xkcJ87-E4jkYIDT2dBxOFJHUQvZxbU8",
  authDomain: "myblogcomments-22808.firebaseapp.com",
  projectId: "myblogcomments-22808",
  storageBucket: "myblogcomments-22808.firebasestorage.app",
  messagingSenderId: "1067155293144",
  appId: "1:1067155293144:web:8f10b016462b52d36628ad"
};

// Init
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Paths
export const POSTS_PATH = 'blog_comments/pages/forum_v2_voted';
export const REPORTS_PATH = 'blog_comments/pages/reports';
export const BOOKMARKS_PATH = 'blog_comments/pages/bookmarks';

// Admin
export const ADMIN_EMAIL = "phys.arif@gmail.com";