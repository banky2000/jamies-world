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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const reviewsRef = db.collection("reviews");
const counterRef = db.collection("metadata").doc("visitors");

// === Visitor Counter ===
async function incrementVisitorCount() {
  try {
    await counterRef.set({
      count: firebase.firestore.FieldValue.increment(1)
    }, { merge: true });

    const doc = await counterRef.get();
    const count = doc.exists ? doc.data().count : 1;
    const counterEl = document.getElementById("visitor-count");
    if (counterEl) counterEl.innerText = count;
  } catch (error) {
    console.error("Visitor counter error:", error);
  }
}

// === Load Reviews ===
async function loadReviews() {
  try {
    const snapshot = await reviewsRef.orderBy("timestamp", "desc").get();
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
    await reviewsRef.add({
      name,
      message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    document.getElementById('message').value = "";
    loadReviews();
  } catch (error) {
    console.error("Error submitting review:", error);
  }
}

// === Init on DOM Load ===
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("visitor-count")) {
    incrementVisitorCount();
  }
  if (document.getElementById("review-list")) {
    loadReviews();
  }
});
