import { db } from "./firebase-config.js";  
import { collection, addDoc, getDocs, onSnapshot, doc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const commentForm = document.getElementById("comment-form");
    const commentsContainer = document.getElementById("comments-container");
    const chapterSelect = document.getElementById("chapter-select");

    // ✅ Fetch comments and display them
    async function fetchComments(chapter) {
        commentsContainer.innerHTML = "<p>Loading comments...</p>";

        try {
            const querySnapshot = await getDocs(collection(db, "chapters", chapter, "comments"));
            commentsContainer.innerHTML = ""; // Clear loading text

            querySnapshot.forEach(async (doc) => {
                const commentData = doc.data();
                const commentDiv = await createCommentElement(commentData, chapter, doc.id);
                commentsContainer.appendChild(commentDiv);
            });

        } catch (error) {
            console.error("❌ Error fetching comments:", error);
        }
    }

    // ✅ Function to create a comment element and fetch replies dynamically
    async function createCommentElement(comment, chapter, commentId, parentId = null) {
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");
        commentDiv.innerHTML = `
            <strong>${comment.username}</strong>: ${comment.text}
            <button class="reply-btn" data-chapter="${chapter}" data-id="${commentId}" data-parent="${parentId}">Reply</button>
            <div class="replies"></div>
        `;

        const repliesDiv = commentDiv.querySelector(".replies");

        // Fetch replies dynamically from Firestore (instead of using an array)
        try {
            const repliesSnapshot = await getDocs(collection(db, "chapters", chapter, "comments", commentId, "replies"));
            repliesSnapshot.forEach(async (replyDoc) => {
                const replyData = replyDoc.data();
                const replyDiv = await createCommentElement(replyData, chapter, replyDoc.id, commentId);
                repliesDiv.appendChild(replyDiv);
            });
        } catch (error) {
            console.error("❌ Error fetching replies:", error);
        }

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
                text: commentText
            });

            commentForm.reset();
            fetchComments(chapter);

        } catch (error) {
            console.error("❌ Error adding comment:", error);
        }
    });

    // ✅ Reply to a comment (supports unlimited nested replies)
    commentsContainer.addEventListener("click", async (e) => {
        if (e.target.classList.contains("reply-btn")) {
            const chapter = e.target.getAttribute("data-chapter");
            const commentId = e.target.getAttribute("data-id");
            const parentId = e.target.getAttribute("data-parent");

            const replyUsername = prompt("Enter your name:");
            const replyText = prompt("Enter your reply:");

            if (replyUsername && replyText) {
                try {
                    let replyPath;

                    if (parentId === "null") {
                        // Replying to a top-level comment
                        replyPath = collection(db, "chapters", chapter, "comments", commentId, "replies");
                    } else {
                        // Replying to a reply (nested reply)
                        replyPath = collection(db, "chapters", chapter, "comments", parentId, "replies", commentId, "replies");
                    }

                    await addDoc(replyPath, {
                        username: replyUsername,
                        text: replyText
                    });

                    fetchComments(chapter); // Refresh comments after replying

                } catch (error) {
                    console.error("❌ Error adding reply:", error);
                }
            }
        }
    });

    // ✅ Listen for real-time updates
    chapterSelect.addEventListener("change", () => {
        fetchComments(chapterSelect.value);
    });

    onSnapshot(collection(db, "chapters", chapterSelect.value, "comments"), () => {
        fetchComments(chapterSelect.value);
    });

    // ✅ Load initial comments
    fetchComments(chapterSelect.value);
});

