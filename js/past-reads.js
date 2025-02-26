// Import Firestore from firebase-config.js
import { db } from "../js/firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
    const books = document.querySelectorAll(".book");

    books.forEach(async (book) => {
        const bookTitle = book.getAttribute("data-book-title"); // Get book title from data attribute
        const ratingContainer = book.querySelector(".average-rating");

        if (!bookTitle || !ratingContainer) return;

        try {
            console.log(`Fetching reviews for: ${bookTitle}`); // Debugging log

            const reviewsSnapshot = await getDocs(collection(db, "reviews", bookTitle, "user-reviews"));

            if (reviewsSnapshot.empty) {
                console.log(`No ratings found for: ${bookTitle}`);
                ratingContainer.innerHTML = "No ratings yet";
                return;
            }

            let totalRating = 0;
            let reviewCount = 0;

            reviewsSnapshot.forEach(doc => {
                console.log(`Review Data for ${bookTitle}:`, doc.data()); // Debugging log
                totalRating += Number(doc.data().rating);
                reviewCount++;
            });

            const averageRating = (totalRating / reviewCount).toFixed(1);

            // Generate stars based on average rating
            let stars = "";
            for (let i = 1; i <= 5; i++) {
                stars += i <= Math.round(averageRating) ? "★" : "☆";
            }

            ratingContainer.innerHTML = `${stars} (${averageRating})`;

        } catch (error) {
            console.error(`Error fetching rating for ${bookTitle}:`, error);
            ratingContainer.innerHTML = "Error loading rating";
        }
    });
});
