// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyD51x2Q-ndQYOOd7XffO0Tr2_4CGYzFOxU",
  authDomain: "jamiesworld-counter.firebaseapp.com",
  projectId: "jamiesworld-counter",
  storageBucket: "jamiesworld-counter.firebasestorage.app",
  messagingSenderId: "980147429276",
  appId: "1:980147429276:web:332ab02f4b52e0fcbbb259",
  measurementId: "G-GD6X3XCHZC"
};

export const app = initializeApp(firebaseConfig);
