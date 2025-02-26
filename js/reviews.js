import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
    const reviewsList = document.getElementById("reviews-list");
    const reviewForm = document.getElementById("review-form");

    // Fetch reviews from Firestore
    async function loadReviews() {
        reviewsList.innerHTML = "<p>Loading reviews...</p>";
        const reviewsSnapshot = await getDocs(collection(db, "reviews", bookTitle, "user-reviews"));
        
        reviewsList.innerHTML = ""; // Clear loading text

        reviewsSnapshot.forEach(doc => {
            const review = doc.data();
            const reviewItem = document.createElement("div");
            reviewItem.classList.add("review");
            reviewItem.innerHTML = `<strong>${review.username}</strong>: ⭐${"⭐".repeat(review.rating)}<br>${review.text}`;
            reviewsList.appendChild(reviewItem);
        });
    }

    // Handle review submission
    reviewForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const rating = document.querySelector('input[name="rating"]:checked')?.value;
        const reviewText = document.getElementById("review-text").value;

        if (!username || !rating || !reviewText) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            await addDoc(collection(db, "reviews", bookTitle, "user-reviews"), {
                username,
                rating: parseInt(rating),
                text: reviewText
            });

            reviewForm.reset();
            loadReviews(); // Refresh the list
        } catch (error) {
            console.error("Error adding review:", error);
        }
    });

    // Load reviews when page loads
    loadReviews();
});
