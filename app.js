import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, addDoc, query, onSnapshot, serverTimestamp, orderBy } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB_xkcJ87-E4jkYIDT2dBxOFJHUQvZxbU8",
    authDomain: "myblogcomments-22808.firebaseapp.com",
    projectId: "myblogcomments-22808",
    storageBucket: "myblogcomments-22808.firebasestorage.app",
    messagingSenderId: "1067155293144",
    appId: "1:1067155293144:web:8f10b016462b52d36628ad"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ১. লগইন ফাংশন
window.googleLogin = async () => {
    try { await signInWithPopup(auth, provider); } catch (e) { console.error(e); }
};

// ২. পোস্ট লিস্ট দেখানোর ফাংশন (index.html এর জন্য)
const postContainer = document.getElementById('comments-container'); // তোমার HTML অনুযায়ী আইডি

function loadPosts() {
    const q = query(collection(db, "all_posts"), orderBy("at", "desc"));
    onSnapshot(q, (snapshot) => {
        postContainer.innerHTML = '';
        snapshot.forEach((doc) => {
            const data = doc.data();
            postContainer.innerHTML += `
                <div class="p-4 border-b dark:border-darkBorder hover:bg-gray-50 dark:hover:bg-darkCard cursor-pointer" onclick="location.href='post.html?id=${doc.id}'">
                    <h2 class="text-lg font-bold">${data.title || 'শিরোনামহীন পোস্ট'}</h2>
                    <p class="text-sm text-gray-500">${data.name} • ${new Date(data.at?.seconds * 1000).toLocaleDateString('bn-BD')}</p>
                </div>
            `;
        });
    });
}

// ৩. নতুন পোস্ট করার ফাংশন
window.postData = async () => {
    const msg = document.getElementById('user-comment').value;
    if(!msg.trim() || !auth.currentUser) return;

    await addDoc(collection(db, "all_posts"), {
        name: auth.currentUser.displayName,
        msg: msg,
        title: msg.substring(0, 50) + "...", // প্রথম কয়েকটা শব্দ টাইটেল হিসেবে
        at: serverTimestamp(),
        userId: auth.currentUser.uid,
        photoURL: auth.currentUser.photoURL
    });
    document.getElementById('user-comment').value = '';
    window.togglePostModal(); // মডাল বন্ধ করা
};

// পেজ লোড হলে পোস্ট দেখাবে
loadPosts();
