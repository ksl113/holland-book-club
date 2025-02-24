// discussion.js
document.addEventListener("DOMContentLoaded", () => {
    const commentForm = document.getElementById("comment-form");
    const commentsContainer = document.getElementById("comments-container");

    // Load existing comments from local storage
    let comments = JSON.parse(localStorage.getItem("comments")) || [];

    function renderComments() {
        commentsContainer.innerHTML = "";
        comments.forEach((comment, index) => {
            const commentDiv = document.createElement("div");
            commentDiv.classList.add("comment");
            commentDiv.innerHTML = `
                <strong>${comment.username}</strong>: ${comment.text}
                <button class="reply-btn" data-index="${index}">Reply</button>
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

        if (username.trim() && commentText.trim()) {
            comments.push({ username, text: commentText, replies: [] });
            localStorage.setItem("comments", JSON.stringify(comments));
            renderComments();
            commentForm.reset();
        }
    });

    commentsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("reply-btn")) {
            const index = e.target.getAttribute("data-index");
            const replyUsername = prompt("Enter your name:");
            const replyText = prompt("Enter your reply:");

            if (replyUsername && replyText) {
                comments[index].replies.push({ username: replyUsername, text: replyText });
                localStorage.setItem("comments", JSON.stringify(comments));
                renderComments();
            }
        }
    });

    renderComments();
});
