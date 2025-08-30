// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBwET1o7kvQ9bmaJeYYFrPQiztMMWnzvk8",
  authDomain: "funx-site.firebaseapp.com",
  projectId: "funx-site",
  storageBucket: "funx-site.firebasestorage.app",
  messagingSenderId: "760681309946",
  appId: "1:760681309946:web:409b4e70c4e257672b0b43",
  measurementId: "G-68NP5TBNQT"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// الحفاظ على الجلسة حتى بعد غلق المتصفح
setPersistence(auth, browserLocalPersistence);
