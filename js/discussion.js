import { db } from "./firebase-config.js";  // Import Firestore from your config file
import { collection, addDoc, getDocs, onSnapshot, doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const commentForm = document.getElementById("comment-form");
    const commentsContainer = document.getElementById("comments-container");
    const chapterSelect = document.getElementById("chapter-select");
    const clearCommentsButton = document.getElementById("clear-comments");

    // Function to load comments from Firestore
    async function fetchComments(chapter) {
        commentsContainer.innerHTML = "";
        const querySnapshot = await getDocs(collection(db, "chapters", chapter, "comments"));

        querySnapshot.forEach((doc) => {
            const commentData = doc.data();
            const commentDiv = createCommentElement(commentData, chapter, doc.id);
            commentsContainer.appendChild(commentDiv);
        });
    }

    // Function to create a comment element
    function createCommentElement(comment, chapter, commentId) {
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");
        commentDiv.innerHTML = `
            <strong>${comment.username}</strong>: ${comment.text}
            <button class="reply-btn" data-chapter="${chapter}" data-id="${commentId}">Reply</button>
            <div class="replies"></div>
        `;

        // Fetch and display replies
        if (comment.replies) {
            const repliesDiv = commentDiv.querySelector(".replies");
            comment.replies.forEach(reply => {
                const replyDiv = document.createElement("div");
                replyDiv.classList.add("reply");
                replyDiv.innerHTML = `<strong>${reply.username}</strong>: ${reply.text}`;
                repliesDiv.appendChild(replyDiv);
            });
        }

        return commentDiv;
    }

    // Submit new comment to Firestore
    commentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const commentText = document.getElementById("comment").value;
        const chapter = chapterSelect.value;

        try {
            await addDoc(collection(db, "chapters", chapter, "comments"), {
                username,
                text: commentText,
                replies: []
            });

            commentForm.reset();
        } catch (error) {
            console.error("Error adding comment: ", error);
        }
    });

    // Reply to a comment
    commentsContainer.addEventListener("click", async (e) => {
        if (e.target.classList.contains("reply-btn")) {
            const chapter = e.target.getAttribute("data-chapter");
            const commentId = e.target.getAttribute("data-id");
            const replyUsername = prompt("Enter your name:");
            const replyText = prompt("Enter your reply:");

            if (replyUsername && replyText) {
                const commentRef = doc(db, "chapters", chapter, "comments", commentId);
                
                try {
                    await updateDoc(commentRef, {
                        replies: arrayUnion({ username: replyUsername, text: replyText })
                    });
                } catch (error) {
                    console.error("Error adding reply: ", error);
                }
            }
        }
    });

    // Listen for real-time updates
    chapterSelect.addEventListener("change", () => {
        fetchComments(chapterSelect.value);
    });

    onSnapshot(collection(db, "chapters", chapterSelect.value, "comments"), () => {
        fetchComments(chapterSelect.value);
    });

    fetchComments(chapterSelect.value);
});

    renderComments(chapterSelect.value);
});
