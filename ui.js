// ----- Toast -----
export function showToast(msg = "Done") {
  const toast = document.createElement("div");
  toast.className = `
    fixed bottom-6 left-1/2 -translate-x-1/2 
    bg-black text-white px-4 py-2 rounded-lg 
    shadow-lg text-xs z-50 animate-fade
  `;
  toast.innerText = msg;

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2200);
}

// ----- Theme -----
window.toggleTheme = () => {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
};

// Init theme
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
}

// ----- Modal -----
window.openModal = (id) => {
  document.getElementById(id)?.classList.remove("hidden");
};

window.closeModal = (id) => {
  document.getElementById(id)?.classList.add("hidden");
};

// ----- Search -----
window.bindSearch = () => {
  const input = document.getElementById("search-input");
  if (!input) return;

  input.addEventListener("input", e => {
    const val = e.target.value.toLowerCase();
    if (window.render) window.render(val);
  });
};

// ----- Init -----
window.addEventListener("DOMContentLoaded", () => {
  bindSearch();
});