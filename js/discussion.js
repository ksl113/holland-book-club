// discussion.js
document.addEventListener("DOMContentLoaded", () => {
    const commentForm = document.getElementById("comment-form");
    const commentsContainer = document.getElementById("comments-container");
    const chapterSelect = document.getElementById("chapter-select");

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
                <button class="reply-btn" data-chapter="${chapter}" data-index="${index}">Reply</button>
                <div class="replies"></div>
            `;

            // Add replies
            const repliesDiv = commentDiv.querySelector(".replies");
            comment.replies.forEach(reply => {
                const replyDiv = document.createElement("div");
                replyDiv.classList.add("reply");
                replyDiv.innerHTML = `<strong>${reply.username}</strong>: ${reply.text}`;
                repliesDiv.appendChild(replyDiv);
            });

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

        commentsByChapter[chapter].push({ username, text: commentText, replies: [] });
        localStorage.setItem("commentsByChapter", JSON.stringify(commentsByChapter));

        renderComments(chapter);
        commentForm.reset();
    });

    commentsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("reply-btn")) {
            const chapter = e.target.getAttribute("data-chapter");
            const index = e.target.getAttribute("data-index");
            const replyUsername = prompt("Enter your name:");
            const replyText = prompt("Enter your reply:");

            if (replyUsername && replyText) {
                commentsByChapter[chapter][index].replies.push({ username: replyUsername, text: replyText });
                localStorage.setItem("commentsByChapter", JSON.stringify(commentsByChapter));
                renderComments(chapter);
            }
        }
    });

    chapterSelect.addEventListener("change", () => {
        renderComments(chapterSelect.value);
    });

    renderComments(chapterSelect.value);
});
