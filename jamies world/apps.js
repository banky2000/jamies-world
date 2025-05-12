// apps.js (Firebase Modular v9+)

import { getFirestore, doc, getDoc, updateDoc, setDoc, collection, query, orderBy, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { app } from './firebase-init.js';

const db = getFirestore(app);

// 1. VISITOR COUNTER
async function updateVisitorCount() {
  const counterRef = doc(db, "siteStats", "visits");
  const counterEl = document.getElementById("visitor-count");

  try {
    const snap = await getDoc(counterRef);

    if (snap.exists()) {
      const currentCount = snap.data().count || 0;
      await updateDoc(counterRef, { count: currentCount + 1 });
      if (counterEl) {
        counterEl.innerText = currentCount + 1;
      }
    } else {
      await setDoc(counterRef, { count: 1 });
      if (counterEl) {
        counterEl.innerText = 1;
      }
    }
  } catch (err) {
    console.error("Visitor counter error:", err);
    if (counterEl) {
      counterEl.innerText = "Error";
    }
  }
}

updateVisitorCount();

// 2. CENTER HEADER IMAGE (optional visual tweak)
const headerImg = document.querySelector('.header-image');
if (headerImg) {
  headerImg.style.margin = '0 auto 2rem auto';
  headerImg.style.maxWidth = '600px';
}

// 3. LOAD REVIEWS (for reviews.html only)
async function loadReviews() {
  const reviewList = document.getElementById("review-list");
  if (!reviewList) return;

  try {
    const reviewsCol = collection(db, "reviews");
    const q = query(reviewsCol, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    reviewList.innerHTML = "";
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

// 4. SUBMIT REVIEW FUNCTION (used by reviews.html)
window.submitReview = async function () {
  const name = document.getElementById("name")?.value.trim();
  const text = document.getElementById("message")?.value.trim();

  if (!name || !text) {
    alert("Please fill in both fields.");
    return;
  }

  try {
    await addDoc(collection(db, "reviews"), {
      name,
      text,
      timestamp: serverTimestamp()
    });

    document.getElementById("name").value = "";
    document.getElementById("message").value = "";
    alert("Review submitted!");
    location.reload();
  } catch (err) {
    console.error("Error adding review:", err);
    alert("Failed to submit review.");
  }
};
