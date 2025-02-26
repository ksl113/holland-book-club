// Import Firestore from the shared firebase-config.js file
import { db } from "../js/firebase-config.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
    const reviewsList = document.getElementById("reviews-list");
    const reviewForm = document.getElementById("review-form");
    const averageRatingElement = document.getElementById("average-rating");

    let selectedRating = 0; // Stores the selected star rating

    // Get the book title from the global `window` object (set in HTML)
const bookTitle = window.bookTitle || "Unknown Book"; 

if (bookTitle === "Unknown Book") {
    console.error("⚠️ Error: Book title is not set. Make sure it's defined in the HTML.");
}

    // Ensure star selection updates correctly
    document.querySelectorAll('.star-rating input').forEach(star => {
        star.addEventListener('change', (event) => {
            selectedRating = parseInt(event.target.value);
            updateStarDisplay(selectedRating);
        });
    });

    // Function to update the visual star display on click
    function updateStarDisplay(rating) {
        document.querySelectorAll('.star-rating label').forEach((label, index) => {
            if (5 - index <= rating) {
                label.style.color = "#FFD700"; // Filled star
            } else {
                label.style.color = "#bbb"; // Empty star
            }
        });
    }

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
            const ratingValue = Number(review.rating); // Ensure the rating is treated as a number

            const reviewItem = document.createElement("div");
            reviewItem.classList.add("review");

            // Generate stars for the review rating
            let stars = "";
            for (let i = 1; i <= 5; i++) {
                stars += i <= ratingValue ? "★" : "☆"; // Fill stars correctly
            }

            reviewItem.innerHTML = `<strong>${review.username}</strong>: ${stars}<br>${review.text}`;
            reviewsList.appendChild(reviewItem);

            totalRating += ratingValue;
            reviewCount++;
        });

        // Calculate and display the average rating
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
        const reviewText = document.getElementById("review-text").value;

        if (!username || selectedRating === 0 || !reviewText) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            await addDoc(collection(db, "reviews", bookTitle, "user-reviews"), {
                username,
                rating: selectedRating,
                text: reviewText
            });

            reviewForm.reset();
            selectedRating = 0; // Reset the stored rating after submission
            updateStarDisplay(0); // Reset the star display
            loadReviews(); // Refresh the reviews list

        } catch (error) {
            console.error("Error adding review:", error);
            alert("Error submitting review. Please try again.");
        }
    });

    // Load reviews when page loads
    loadReviews();
});
