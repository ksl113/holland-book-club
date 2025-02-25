import { db } from "./firebase-config.js";  
import { collection, addDoc, getDocs, onSnapshot, doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const commentForm = document.getElementById("comment-form");
    const commentsContainer = document.getElementById("comments-container");
    const chapterSelect = document.getElementById("chapter-select");
    const clearCommentsButton = document.getElementById("clear-comments");

    // ✅ Fetch comments when the page loads
    async function fetchComments(chapter) {
        commentsContainer.innerHTML = "<p>Loading comments...</p>";
        
        try {
            const querySnapshot = await getDocs(collection(db, "chapters", chapter, "comments"));
            commentsContainer.innerHTML = ""; // Clear loading text

            querySnapshot.forEach((doc) => {
                const commentData = doc.data();
                const commentDiv = createCommentElement(commentData, chapter, doc.id);
                commentsContainer.appendChild(commentDiv);
            });

        } catch (error) {
            console.error("❌ Error fetching comments:", error);
        }
    }

    // ✅ Function to create comment elements
    function createCommentElement(comment, chapter, commentId) {
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");
        commentDiv.innerHTML = `
            <strong>${comment.username}</strong>: ${comment.text}
            <button class="reply-btn" data-chapter="${chapter}" data-id="${commentId}">Reply</button>
            <div class="replies"></div>
        `;

        return commentDiv;
    }

    // ✅ Submit new comment to Firestore
    commentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const commentText = document.getElementById("comment").value;
        const chapter = chapterSelect.value;

        if (!username || !commentText) {
            alert("Please enter your name and a comment.");
            return;
        }

        try {
            await addDoc(collection(db, "chapters", chapter, "comments"), {
                username,
                text: commentText,
                replies: []
            });

            commentForm.reset();
            fetchComments(chapter); // Refresh comments after submitting
        } catch (error) {
            console.error("❌ Error adding comment:", error);
        }
    });

    // ✅ Reply to a comment
    commentsContainer.addEventListener("click", async (e) => {
        if (e.target.classList.contains("reply-btn")) {
            const chapter = e.target.getAttribute("data-chapter");
            const commentId = e.target.getAttribute("data-id");
            const replyUsername = prompt("Enter your name:");
            const replyText = prompt("Enter your reply:");

            if (replyUsername && replyText) {
                try {
                    const commentRef = doc(db, "chapters", chapter, "comments", commentId);
                    await updateDoc(commentRef, {
                        replies: arrayUnion({ username: replyUsername, text: replyText })
                    });

                    fetchComments(chapter); // Refresh comments
                } catch (error) {
                    console.error("❌ Error adding reply:", error);
                }
            }
        }
    });

    // ✅ Listen for real-time updates
    onSnapshot(collection(db, "chapters", chapterSelect.value, "comments"), () => {
        fetchComments(chapterSelect.value);
    });

    // ✅ Load initial comments
    fetchComments(chapterSelect.value);
});
