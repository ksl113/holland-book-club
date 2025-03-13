import { db } from "./firebase-config.js";  
import { collection, addDoc, getDocs, onSnapshot, doc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const commentForm = document.getElementById("comment-form");
    const commentsContainer = document.getElementById("comments-container");
    const chapterSelect = document.getElementById("chapter-select");

    // ✅ Function to update chapter dropdown counts
    async function updateChapterDropdownCounts() {
        for (let option of chapterSelect.options) {
            const chapter = option.value;
            const commentsRef = collection(db, "chapters", chapter, "comments");

            // Get real-time comment count
            onSnapshot(commentsRef, (snapshot) => {
                const commentCount = snapshot.size; // Number of comments in Firestore
                option.textContent = `Chapter ${chapter.split('-')[1]} (${commentCount})`;
            });
        }
    }

    // ✅ Fetch and listen for changes to comments in real-time
    function fetchComments(chapter) {
        commentsContainer.innerHTML = "<p>Loading comments...</p>";

        const commentsRef = collection(db, "chapters", chapter, "comments");

        onSnapshot(commentsRef, (snapshot) => {
            commentsContainer.innerHTML = ""; // Clear old comments

            snapshot.forEach((doc) => {
                const commentData = doc.data();
                const commentDiv = createCommentElement(commentData, chapter, doc.id);
                commentsContainer.appendChild(commentDiv);

                // Load replies for this comment in real-time
                fetchReplies(chapter, doc.id, commentDiv.querySelector(".replies"));
            });

            // ✅ Update dropdown count when comments change
            updateChapterDropdownCounts();
        });
    }

    // ✅ Fetch replies in real-time (supports unlimited nesting)
    function fetchReplies(chapter, commentId, repliesContainer) {
        const repliesRef = collection(db, "chapters", chapter, "comments", commentId, "replies");

        onSnapshot(repliesRef, (snapshot) => {
            repliesContainer.innerHTML = ""; // Clear old replies

            snapshot.forEach((doc) => {
                const replyData = doc.data();
                const replyDiv = createCommentElement(replyData, chapter, doc.id);
                repliesContainer.appendChild(replyDiv);

                // Load nested replies in real-time
                fetchReplies(chapter, doc.id, replyDiv.querySelector(".replies"));
            });
        });
    }

    // ✅ Create a comment element with a reply button
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

    // ✅ Submit a new comment to Firestore
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
                text: commentText
            });

            commentForm.reset();
            updateChapterDropdownCounts(); // ✅ Update dropdown counts

        } catch (error) {
            console.error("❌ Error adding comment:", error);
        }
    });

    // ✅ Reply to any comment (supports unlimited nesting)
    commentsContainer.addEventListener("click", async (e) => {
        if (e.target.classList.contains("reply-btn")) {
            const chapter = e.target.getAttribute("data-chapter");
            const commentId = e.target.getAttribute("data-id");

            const replyUsername = prompt("Enter your name:");
            const replyText = prompt("Enter your reply:");

            if (replyUsername && replyText) {
                try {
                    await addDoc(collection(db, "chapters", chapter, "comments", commentId, "replies"), {
                        username: replyUsername,
                        text: replyText
                    });

                } catch (error) {
                    console.error("❌ Error adding reply:", error);
                }
            }
        }
    });

    // ✅ Load comments when the selected chapter changes
    chapterSelect.addEventListener("change", () => {
        fetchComments(chapterSelect.value);
    });

    // ✅ Load initial comments and update dropdown counts
    fetchComments(chapterSelect.value);
    updateChapterDropdownCounts();
});

