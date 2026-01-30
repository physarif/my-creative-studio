import { db, POSTS_PATH, REPORTS_PATH, BOOKMARKS_PATH } from './firebase.js';
import {
  collection, addDoc, doc, setDoc, getDocs, updateDoc,
  deleteDoc, increment, query, serverTimestamp, onSnapshot, where
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

import { toBN, formatTime } from './utils.js';
import { showToast } from './ui.js';

// ----- State -----
export let allData = [];
export let reportedPosts = [];
export let activeThreadId = null;
export let currentFilter = 'latest';
export let userBookmarks = [];

// ----- Collections -----
const commentsCol = collection(db, POSTS_PATH);
const reportsCol  = collection(db, REPORTS_PATH);

// ----- Realtime Posts -----
onSnapshot(commentsCol, (snapshot) => {
  allData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  render();
  if (activeThreadId) updateDetails();
});

// ----- Render -----
export function render(searchTerm = '') {
  const container = document.getElementById('posts-container');
  let posts = allData.filter(c => !c.parentId);

  if (searchTerm)
    posts = posts.filter(p => p.msg.toLowerCase().includes(searchTerm));

  if (currentFilter === 'latest')
    posts.sort((a,b) => (b.at?.seconds||0)-(a.at?.seconds||0));
  else if (currentFilter === 'popular')
    posts.sort((a,b) => (b.votes||0)-(a.votes||0));
  else if (currentFilter === 'featured')
    posts = posts.filter(p => p.featured);
  else if (currentFilter === 'bookmarks')
    posts = posts.filter(p => userBookmarks.includes(p.id));
  else if (currentFilter === 'reports') {
    const ids = [...new Set(reportedPosts.map(r=>r.postId))];
    posts = posts.filter(p=>ids.includes(p.id));
  }

  if (!posts.length) {
    container.innerHTML = `<div class="p-20 text-center text-gray-400">কিছু পাওয়া যায়নি</div>`;
    return;
  }

  container.innerHTML = posts.map(c => {
    const repliesCount = allData.filter(r => r.parentId === c.id).length;
    return `
      <div class="forum-card bg-white dark:bg-darkCard p-4 rounded-xl border dark:border-darkBorder">
        <div class="flex gap-4">
          <div class="flex flex-col items-center gap-1 bg-gray-50 dark:bg-darkBg p-1.5 rounded-lg min-w-[42px]">
            <button onclick="handleVote('${c.id}',1)">⬆</button>
            <span class="font-bold text-xs text-accent">${toBN(c.votes||0)}</span>
            <button onclick="handleVote('${c.id}',-1)">⬇</button>
          </div>
          <div class="flex-1 cursor-pointer" onclick="openDetails('${c.id}')">
            <h2 class="text-sm font-semibold mb-2">${c.msg}</h2>
            <div class="text-[10px] text-gray-400">${toBN(repliesCount)} মন্তব্য</div>
          </div>
        </div>
      </div>`;
  }).join('');
}

// ----- Filters -----
window.setFilter = async (filter) => {
  currentFilter = filter;
  if(filter === 'reports' && window.isAdmin) {
    const snap = await getDocs(reportsCol);
    reportedPosts = snap.docs.map(d=>({id:d.id,...d.data()}));
  }
  render();
};

// ----- Post -----
window.submitPost = async () => {
  if(!currentUser) return googleLogin();
  const el = document.getElementById('user-comment');
  const msg = el.value.trim();
  if(!msg) return;

  await addDoc(commentsCol, {
    name: currentUser.displayName,
    msg,
    parentId: null,
    votes: 0,
    photoURL: currentUser.photoURL,
    userId: currentUser.uid,
    at: serverTimestamp()
  });

  el.value = '';
  showToast('পোস্ট হয়েছে');
};

// ----- Reply -----
window.postReply = async () => {
  if(!currentUser) return googleLogin();
  const input = document.getElementById('reply-input');

  await addDoc(commentsCol, {
    name: currentUser.displayName,
    msg: input.value,
    parentId: activeThreadId,
    photoURL: currentUser.photoURL,
    userId: currentUser.uid,
    at: serverTimestamp()
  });

  input.value = '';
};

// ----- Vote -----
window.handleVote = async (id,val)=>{
  if(!currentUser) return googleLogin();
  await updateDoc(doc(db,POSTS_PATH,id),{votes:increment(val)});
};

// ----- Details -----
window.openDetails = (id)=>{
  activeThreadId = id;
  document.getElementById('details-view').style.display='block';
  updateDetails();
};

export function updateDetails(){
  const post = allData.find(p=>p.id===activeThreadId);
  if(!post) return;

  const replies = allData.filter(r=>r.parentId===activeThreadId);

  document.getElementById('details-content').innerHTML = `
    <h3 class="font-bold mb-3">${post.msg}</h3>
    <div class="space-y-3">
      ${replies.map(r=>`<div class="text-xs bg-gray-100 p-2 rounded">${r.msg}</div>`).join('')}
    </div>`;
}

// ----- Delete -----
window.deletePost = async (id)=>{
  if(confirm('মুছবেন?'))
    await deleteDoc(doc(db,POSTS_PATH,id));
};