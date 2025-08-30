// firebase-config.js
// استيراد Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

// إعدادات Firebase الخاصة بيك
const firebaseConfig = {
  apiKey: "AIzaSyBwET1o7kvQ9bmaJeYYFrPQiztMMWnzvk8",
  authDomain: "funx-site.firebaseapp.com",
  projectId: "funx-site",
  storageBucket: "funx-site.firebasestorage.app",
  messagingSenderId: "760681309946",
  appId: "1:760681309946:web:409b4e70c4e257672b0b43",
  measurementId: "G-68NP5TBNQT"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
