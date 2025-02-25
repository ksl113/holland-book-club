document.addEventListener("DOMContentLoaded", () => {
    const commentForm = document.getElementById("comment-form");
    const commentsContainer = document.getElementById("comments-container");
    const chapterSelect = document.getElementById("chapter-select");
    const clearCommentsButton = document.getElementById("clear-comments");

    let commentsByChapter = JSON.parse(localStorage.getItem("commentsByChapter")) || {};

    function renderComments(chapter) {
        commentsContainer.innerHTML = "";
        if (!commentsByChapter[chapter]) return;

        commentsByChapter[chapter].forEach((comment, index) => {
            const commentDiv = createCommentElement(comment, chapter, index);
            commentsContainer.appendChild(commentDiv);
        });
    }

    function createCommentElement(comment, chapter, index, parentIndex = null) {
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");
        commentDiv.innerHTML = `
            <strong>${comment.username}</strong>: ${comment.text}
            <button class="reply-btn" data-chapter="${chapter}" data-index="${index}" data-parent="${parentIndex}">Reply</button>
            <div class="replies"></div>
        `;

        const repliesDiv = commentDiv.querySelector(".replies");
        if (comment.replies) {
            comment.replies.forEach((reply, replyIndex) => {
                const replyDiv = createCommentElement(reply, chapter, replyIndex, index);
                repliesDiv.appendChild(replyDiv);
            });
        }

        return commentDiv;
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
            const parentIndex = e.target.getAttribute("data-parent");
            const replyUsername = prompt("Enter your name:");
            const replyText = prompt("Enter your reply:");

            if (replyUsername && replyText) {
                let targetArray = commentsByChapter[chapter];

                if (parentIndex !== "null") {
                    targetArray = commentsByChapter[chapter][parentIndex].replies;
                }

                targetArray[index].replies.push({ username: replyUsername, text: replyText, replies: [] });
                localStorage.setItem("commentsByChapter", JSON.stringify(commentsByChapter));
                renderComments(chapter);
            }
        }
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
