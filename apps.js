// === Import Firebase ===
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, orderBy, getDocs } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

// === Firebase Config ===
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// === Initialize Firebase ===
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const reviewsRef = collection(db, "reviews");

// === Click Sound ===
const clickSound = new Audio('sounds/blip.wav');
const buttons = document.querySelectorAll('.pixel-button');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    clickSound.currentTime = 0;
    clickSound.play();
  });
});

// === Load Reviews ===
async function loadReviews() {
  try {
    const q = query(reviewsRef, orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    const reviewList = document.getElementById("review-list");
    if (!reviewList) return;
    reviewList.innerHTML = "";

    snapshot.forEach((doc) => {
      const review = doc.data();
      const reviewElement = document.createElement("div");
      reviewElement.classList.add("single-review");
      reviewElement.innerHTML = `
        <p><strong>${review.name}</strong> says:</p>
        <p>${review.message}</p>
        <hr />
      `;
      reviewList.appendChild(reviewElement);
    });
  } catch (error) {
    console.error("Error loading reviews:", error);
  }
}

// === Submit Review ===
async function submitReview() {
  const name = document.getElementById('name').value || "Anonymous";
  const message = document.getElementById('message').value.trim();
  if (!message) return;

  try {
    await addDoc(reviewsRef, {
      name,
      message,
      likes: 0,
      dislikes: 0,
      timestamp: serverTimestamp()
    });
    document.getElementById('message').value = "";
    loadReviews();
  } catch (error) {
    console.error("Error submitting review:", error);
  }
}

// === Load on DOM Ready ===
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("review-list")) {
    loadReviews();
  }
});
