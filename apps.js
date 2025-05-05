// Load the click sound
const clickSound = new Audio('sounds/blip.wav');

// Find all buttons with the class "pixel-button"
const buttons = document.querySelectorAll('.pixel-button');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    clickSound.currentTime = 0; // Rewind to start
    clickSound.play();
  });
});


const db = firebase.firestore(); // Reuse your initialized Firebase

const reviewsRef = db.collection("reviews");

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

// Only load reviews on the Reviews page
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("review-list")) {
    loadReviews();
  }
});

async function submitReview() {
  const name = document.getElementById('name').value || "Anonymous";
  const message = document.getElementById('message').value.trim();
  if (!message) return;

  try {
    await reviewsRef.add({
      name,
      message, //
      likes: 0,
      dislikes: 0,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    document.getElementById('message').value = "";
    loadReviews(); // refresh reviews after submit
  } catch (error) {
    console.error("Error submitting review:", error);
  }
}

