// Import Firestore from the shared firebase-config.js file
import { db } from "../js/firebase-config.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
    const reviewsList = document.getElementById("reviews-list");
    const reviewForm = document.getElementById("review-form");
    const averageRatingElement = document.getElementById("average-rating");

    // Fetch reviews from Firestore
    async function loadReviews() {
        reviewsList.innerHTML = "<p>Loading reviews...</p>";

        try {
            const reviewsSnapshot = await getDocs(collection(db, "reviews", bookTitle, "user-reviews"));
            
            reviewsList.innerHTML = ""; // Clear loading text

            if (reviewsSnapshot.empty) {
                reviewsList.innerHTML = "<p>No reviews yet. Be the first to review!</p>";
            }

            reviewsSnapshot.forEach(doc => {
                const review = doc.data();
                const reviewItem = document.createElement("div");
                reviewItem.classList.add("review");
                reviewItem.innerHTML = `<strong>${review.username}</strong>: ⭐${"⭐".repeat(review.rating)}<br>${review.text}`;
                reviewsList.appendChild(reviewItem);
            });
        } catch (error) {
            console.error("Error loading reviews:", error);
            reviewsList.innerHTML = "<p>Error loading reviews. Please try again later.</p>";
        }
    }

  // Function to fetch and display reviews
    async function loadReviews() {
        reviewsList.innerHTML = "<p>Loading reviews...</p>";
        let totalRating = 0;
        let reviewCount = 0;

        try {
            const reviewsSnapshot = await getDocs(collection(db, "reviews", bookTitle, "user-reviews"));
            reviewsList.innerHTML = ""; // Clear loading text

            if (reviewsSnapshot.empty) {
                reviewsList.innerHTML = "<p>No reviews yet. Be the first to review!</p>";
                averageRatingElement.innerHTML = "No ratings yet";
                return;
            }

            reviewsSnapshot.forEach(doc => {
                const review = doc.data();
                const reviewItem = document.createElement("div");
                reviewItem.classList.add("review");
                reviewItem.innerHTML = `<strong>${review.username}</strong>: ⭐${"⭐".repeat(review.rating)}<br>${review.text}`;
                reviewsList.appendChild(reviewItem);

                totalRating += review.rating;
                reviewCount++;
            });

            // Calculate average rating
            const averageRating = totalRating / reviewCount;
            displayAverageRating(averageRating);

        } catch (error) {
            console.error("Error loading reviews:", error);
            reviewsList.innerHTML = "<p>Error loading reviews. Please try again later.</p>";
            averageRatingElement.innerHTML = "Error loading rating";
        }
    }

    // Function to display the average rating with stars
    function displayAverageRating(avg) {
        const roundedAvg = avg.toFixed(1); // Round to 1 decimal place
        let stars = "";

        for (let i = 1; i <= 5; i++) {
            stars += i <= Math.round(avg) ? "★" : "☆"; // Fill stars up to the rounded average
        }

        averageRatingElement.innerHTML = `${stars} (${roundedAvg})`; // Display stars + number
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
            alert("Error submitting review. Please try again.");
        }
    });

    // Load reviews when page loads
    loadReviews();
});
