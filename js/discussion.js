import { db } from "./firebase-config.js";  
import { collection, addDoc, getDocs, onSnapshot, doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const commentForm = document.getElementById("comment-form");
    const commentsContainer = document.getElementById("comments-container");
    const chapterSelect = document.getElementById("chapter-select");
    const clearCommentsButton = document.getElementById("clear-comments");

    // ✅ Fetch comments and display them
    async function fetchComments(chapter) {
        commentsContainer.innerHTML = "<p>Loading comments...</p>";

        try {
            const querySnapshot = await getDocs(collection(db, "chapters", chapter, "comments"));
            commentsContainer.innerHTML = "";

            querySnapshot.forEach((doc) => {
                const commentData = doc.data();
                const commentDiv = createCommentElement(commentData, chapter, doc.id);
                commentsContainer.appendChild(commentDiv);
            });

        } catch (error) {
            console.error("❌ Error fetching comments:", error);
        }
    }

    // ✅ Function to create a comment element (supports nested replies)
    function createCommentElement(comment, chapter, commentId, parentId = null) {
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");
        commentDiv.innerHTML = `
            <strong>${comment.username}</strong>: ${comment.text}
            <button class="reply-btn" data-chapter="${chapter}" data-id="${commentId}" data-parent="${parentId}">Reply</button>
            <div class="replies"></div>
        `;

        const repliesDiv = commentDiv.querySelector(".replies");

        if (comment.replies && comment.replies.length > 0) {
            comment.replies.forEach((reply, index) => {
                const replyDiv = createCommentElement(reply, chapter, `${commentId}-${index}`, commentId);
                repliesDiv.appendChild(replyDiv);
            });
        }

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
                text: commentText,
                replies: []
            });

            commentForm.reset();
            fetchComments(chapter);

        } catch (error) {
            console.error("❌ Error adding comment:", error);
        }
    });

    // ✅ Reply to any comment (nested replies)
    commentsContainer.addEventListener("click", async (e) => {
        if (e.target.classList.contains("reply-btn")) {
            const chapter = e.target.getAttribute("data-chapter");
            const commentId = e.target.getAttribute("data-id");
            const parentId = e.target.getAttribute("data-parent");

            const replyUsername = prompt("Enter your name:");
            const replyText = prompt("Enter your reply:");

            if (replyUsername && replyText) {
                let commentRef;

                if (parentId === "null") {
                    // Replying to a top-level comment
                    commentRef = doc(db, "chapters", chapter, "comments", commentId);
                } else {
                    // Replying to a reply
                    commentRef = doc(db, "chapters", chapter, "comments", parentId);
                }

                try {
                    await updateDoc(commentRef, {
                        replies: arrayUnion({
                            username: replyUsername,
                            text: replyText,
                            replies: [] // Allows further nesting
                        })
                    });

                    fetchComments(chapter); // Refresh comments after replying

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

