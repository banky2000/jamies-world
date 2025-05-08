// apps.js (Firebase Modular v9+)

import { getFirestore, doc, getDoc, updateDoc, setDoc, collection, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

const app = getApp();
const db = getFirestore(app);

// 1. VISITOR COUNTER
async function updateVisitorCount() {
  const counterRef = doc(db, "siteStats", "visits");

  try {
    const snap = await getDoc(counterRef);

    if (snap.exists()) {
      const currentCount = snap.data().count || 0;
      await updateDoc(counterRef, { count: currentCount + 1 });
      document.getElementById("visitor-count").innerText = currentCount + 1;
    } else {
      await setDoc(counterRef, { count: 1 });
      document.getElementById("visitor-count").innerText = 1;
    }
  } catch (err) {
    console.error("Visitor counter error:", err);
    document.getElementById("visitor-count").innerText = "Error";
  }
}

updateVisitorCount();

// 2. CENTER HEADER IMAGE + SIZE (already handled via CSS in index.html)
// Use this if you want to override via JS instead (optional):
const headerImg = document.querySelector('.header-image');
if (headerImg) {
  headerImg.style.margin = '0 auto 2rem auto';
  headerImg.style.maxWidth = '600px';
}

// 3. LOAD REVIEWS (for reviews.html only)
async function loadReviews() {
  const reviewList = document.getElementById("review-list");
  if (!reviewList) return; // only run this on reviews.html

  try {
    const reviewsCol = collection(db, "reviews");
    const q = query(reviewsCol, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    reviewList.innerHTML = ""; // clear existing
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement("div");
      div.className = "review";
      div.innerHTML = `<p><strong>${data.name}:</strong> ${data.text}</p>`;
      reviewList.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to load reviews:", err);
  }
}

loadReviews();
