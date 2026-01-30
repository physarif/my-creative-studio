import { auth, provider, ADMIN_EMAIL } from './firebase.js';
import { signInWithPopup, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import { setupRealtimeNotifications, setupRealtimeBookmarks } from './forum.js';

window.currentUser = null;
window.isAdmin = false;

// Google Login
window.googleLogin = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (e) {
    console.error(e);
  }
};

// Init Auth Listener
export function initAuth() {
  onAuthStateChanged(auth, (user) => {
    window.currentUser = user;
    window.isAdmin = user?.email === ADMIN_EMAIL;

    const avatar = document.getElementById('user-avatar');
    const loginBtn = document.getElementById('login-ui');

    avatar.classList.toggle('hidden', !user);
    loginBtn.classList.toggle('hidden', !!user);

    if (user) {
      avatar.src = user.photoURL;
      setupRealtimeNotifications(user.uid);
      setupRealtimeBookmarks(user.uid);
    } else {
      if (window.notificationUnsubscribe) window.notificationUnsubscribe();
      if (window.bookmarksUnsubscribe) window.bookmarksUnsubscribe();
    }

    document.getElementById('admin-badge')
      ?.classList.toggle('hidden', !window.isAdmin);

    document.getElementById('filter-reports')
      ?.classList.toggle('hidden', !window.isAdmin);
  });
}

// Optional logout
window.logout = async () => {
  await signOut(auth);
};