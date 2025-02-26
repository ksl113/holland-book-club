// Ensure Firebase is loaded globally (No need for imports)
document.addEventListener("DOMContentLoaded", async () => {
    // Ensure Firestore is initialized
    const db = firebase.firestore();
    
    const reviewsList = document.getElementById("reviews-list");
    const reviewForm = document.getElementById("review-form");

    // Fetch reviews from Firestore
    async function loadReviews() {
        reviewsList.innerHTML = "<p>Loading reviews...</p>";

        try {
            const reviewsSnapshot = await db.collection("reviews").doc(bookTitle).collection("user-reviews").get();
            
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
            await db.collection("reviews").doc(bookTitle).collection("user-reviews").add({
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

