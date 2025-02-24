// discussion.js
document.addEventListener("DOMContentLoaded", () => {
    const commentForm = document.getElementById("comment-form");
    const commentsContainer = document.getElementById("comments-container");
    const chapterSelect = document.getElementById("chapter-select");
    const clearCommentsButton = document.getElementById("clear-comments");

    // Load existing comments from local storage
    let commentsByChapter = JSON.parse(localStorage.getItem("commentsByChapter")) || {};

    function renderComments(chapter) {
        commentsContainer.innerHTML = "";
        if (!commentsByChapter[chapter]) return;

        commentsByChapter[chapter].forEach((comment, index) => {
            const commentDiv = document.createElement("div");
            commentDiv.classList.add("comment");
            commentDiv.innerHTML = `
                <strong>${comment.username}</strong>: ${comment.text}
            `;
            commentsContainer.appendChild(commentDiv);
        });
    }

    commentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const commentText = document.getElementById("comment").value;
        const chapter = chapterSelect.value;

        if (!commentsByChapter[chapter]) {
            commentsByChapter[chapter] = [];
        }

        commentsByChapter[chapter].push({ username, text: commentText });
        localStorage.setItem("commentsByChapter", JSON.stringify(commentsByChapter));

        renderComments(chapter);
        commentForm.reset();
    });

    clearCommentsButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete all comments? This cannot be undone.")) {
            localStorage.removeItem("commentsByChapter");
            commentsByChapter = {};
            renderComments(chapterSelect.value);
        }
    });

    chapterSelect.addEventListener("change", () => {
        renderComments(chapterSelect.value);
    });

    renderComments(chapterSelect.value);
});
