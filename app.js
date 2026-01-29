import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, addDoc, query, onSnapshot, serverTimestamp, orderBy, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
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

// ১. পোস্ট লিস্ট লোড করা (Smart UI)
const postContainer = document.getElementById('comments-container');

if (postContainer) {
    const q = query(collection(db, "all_posts"), orderBy("at", "desc"));
    onSnapshot(q, (snapshot) => {
        postContainer.innerHTML = '';
        snapshot.forEach((doc) => {
            const data = doc.data();
            postContainer.innerHTML += `
                <div class="group p-5 mb-3 bg-white dark:bg-darkCard border border-gray-100 dark:border-darkBorder rounded-2xl hover:border-blue-400 transition-all cursor-pointer" onclick="location.href='post.html?id=${doc.id}'">
                    <div class="flex items-center gap-3 mb-2">
                        <img src="${data.photoURL || ''}" class="w-5 h-5 rounded-full">
                        <span class="text-xs font-bold text-gray-500">${data.name}</span>
                    </div>
                    <h2 class="text-lg font-bold group-hover:text-blue-500">${data.title}</h2>
                    <p class="text-sm text-gray-500 line-clamp-2 mt-1">${data.msg}</p>
                </div>`;
        });
    });
}

// ২. স্মার্ট পোস্ট করার ফাংশন
window.postData = async () => {
    const msg = document.getElementById('user-comment').value;
    if(!msg.trim() || !auth.currentUser) return;

    // প্রথম লাইনকে টাইটেল বানানো
    const smartTitle = msg.split('\n')[0].substring(0, 60);

    await addDoc(collection(db, "all_posts"), {
        name: auth.currentUser.displayName,
        msg: msg,
        title: smartTitle,
        at: serverTimestamp(),
        photoURL: auth.currentUser.photoURL
    });
    
    document.getElementById('user-comment').value = '';
    togglePostModal();
};

// ৩. সিঙ্গেল পোস্ট ভিউ (post.html এর জন্য)
const params = new URLSearchParams(window.location.search);
const postId = params.get('id');

if (window.location.pathname.includes('post.html') && postId) {
    const loadSinglePost = async () => {
        const postSnap = await getDoc(doc(db, "all_posts", postId));
        if (postSnap.exists()) {
            const data = postSnap.data();
            document.getElementById('post-title').innerText = data.title;
            document.getElementById('post-content').innerText = data.msg;
            document.getElementById('post-author').innerText = data.name;
        }
    };
    loadSinglePost();
}

// ৪. অথেনটিকেশন লজিক
window.googleLogin = () => signInWithPopup(auth, provider);
window.handleLogout = () => signOut(auth);

onAuthStateChanged(auth, (user) => {
    // UI আপডেট করার লজিক এখানে
});
