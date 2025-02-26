// Import Firestore from the shared firebase-config.js file
import { db } from "../js/firebase-config.js";  
import { collection, addDoc, getDocs, onSnapshot, doc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
    const books = document.querySelectorAll(".book");

    books.forEach(async (book) => {
        const bookTitle = book.getAttribute("data-book-title"); // Get book title from data attribute
        const ratingContainer = book.querySelector(".average-rating");

        if (!bookTitle || !ratingContainer) return;

        try {
            const reviewsSnapshot = await getDocs(collection(db, "reviews", bookTitle, "user-reviews"));

            if (reviewsSnapshot.empty) {
                ratingContainer.innerHTML = "No ratings yet";
                return;
            }

            let totalRating = 0;
            let reviewCount = 0;

            reviewsSnapshot.forEach(doc => {
                totalRating += Number(doc.data().rating);
                reviewCount++;
            });

            const averageRating = (totalRating / reviewCount).toFixed(1); // Round to 1 decimal place

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
