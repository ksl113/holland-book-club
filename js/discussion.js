// discussion.js
import { getFirestore, collection, addDoc, getDocs, onSnapshot, query, where, orderBy, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const db = window.db;
const commentForm = document.getElementById("comment-form");
const commentsContainer = document.getElementById("comments-container");
const allCommentsContainer = document.getElementById("all-comments-container");
const chapterSelect = document.getElementById("chapter-select");
const commentsRef = collection(db, "comments");

// Function to render comments for selected chapter
function renderComments(chapter) {
    commentsContainer.innerHTML = "";
    
    const q = query(commentsRef, where("chapter", "==", chapter), orderBy("timestamp", "asc"));
    onSnapshot(q, (snapshot) => {
        commentsContainer.innerHTML = "";
        snapshot.forEach((doc) => {
            const comment = doc.data();
            const commentDiv = document.createElement("div");
            commentDiv.classList.add("comment");
            commentDiv.innerHTML = `
                <strong>${comment.username}</strong>: ${comment.text}
                <button class="delete-comment" data-id="${doc.id}">🗑 Delete</button>
            `;
            commentsContainer.appendChild(commentDiv);
        });
    });
}

// Function to render all comments
function renderAllComments() {
    allCommentsContainer.innerHTML = "";
    
    const q = query(commentsRef, orderBy("timestamp", "asc"));
    onSnapshot(q, (snapshot) => {
        allCommentsContainer.innerHTML = "";
        snapshot.forEach((doc) => {
            const comment = doc.data();
            const commentDiv = document.createElement("div");
            commentDiv.classList.add("comment");
            commentDiv.innerHTML = `
                <strong>${comment.username}</strong> (Chapter ${comment.chapter}): ${comment.text}
            `;
            allCommentsContainer.appendChild(commentDiv);
        });
    });
}

// Handle new comment submission
commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const commentText = document.getElementById("comment").value;
    const chapter = chapterSelect.value;

    if (username.trim() && commentText.trim()) {
        await addDoc(commentsRef, {
            username: username,
            text: commentText,
            chapter: chapter,
            timestamp: new Date()
        });
        commentForm.reset();
    }
});

// Handle deleting a comment
commentsContainer.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-comment")) {
        const commentId = e.target.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this comment?")) {
            await deleteDoc(doc(db, "comments", commentId));
        }
    }
});

// Handle clearing all comments
const clearCommentsButton = document.getElementById("clear-comments");
if (clearCommentsButton) {
    clearCommentsButton.addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete all comments?")) {
            const snapshot = await getDocs(commentsRef);
            snapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
        }
    });
}

// Handle clearing chapter-specific comments
const clearChapterCommentsButton = document.getElementById("clear-chapter-comments");
if (clearChapterCommentsButton) {
    clearChapterCommentsButton.addEventListener("click", async () => {
        const chapter = chapterSelect.value;
        if (confirm(`Are you sure you want to delete all comments for Chapter ${chapter}?`)) {
            const q = query(commentsRef, where("chapter", "==", chapter));
            const snapshot = await getDocs(q);
            snapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
        }
    });
}

// Listen for chapter changes
chapterSelect.addEventListener("change", () => {
    renderComments(chapterSelect.value);
});

// Initial rendering
renderComments(chapterSelect.value);
renderAllComments();
