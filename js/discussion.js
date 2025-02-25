// discussion.js
document.addEventListener("DOMContentLoaded", () => {
    const chapterSelector = document.getElementById("chapter-selector");
    const discussionContainer = document.getElementById("discussion-container");
    const currentChapterTitle = document.getElementById("current-chapter-title");
    const commentsSection = document.getElementById("comments-section");
    const commentName = document.getElementById("comment-name");
    const commentText = document.getElementById("comment-text");
    const submitComment = document.getElementById("submit-comment");

    let discussions = JSON.parse(localStorage.getItem("discussions")) || {};

    function loadComments(chapter) {
        currentChapterTitle.innerHTML = `Discussion for ${chapter.replace('-', ' ')}`;
        commentsSection.innerHTML = "";

        if (!discussions[chapter]) {
            discussions[chapter] = [];
        }

        discussions[chapter].forEach((comment, index) => {
            let commentElement = document.createElement("div");
            commentElement.classList.add("comment");
            commentElement.innerHTML = `
                <p><strong>${comment.name}</strong>: ${comment.text}</p>
                <button class="reply-btn" data-chapter="${chapter}" data-index="${index}">Reply</button>
                <div class="replies">${comment.replies.map(reply => `<p><strong>${reply.name}</strong>: ${reply.text}</p>`).join('')}</div>
            `;
            commentsSection.appendChild(commentElement);
        });

        addReplyFunctionality();
    }

    function addReplyFunctionality() {
        document.querySelectorAll(".reply-btn").forEach(button => {
            button.addEventListener("click", function() {
                let chapter = this.dataset.chapter;
                let index = this.dataset.index;
                let replyName = prompt("Enter your name:");
                let replyText = prompt("Enter your reply:");
                if (replyName && replyText) {
                    discussions[chapter][index].replies.push({ name: replyName, text: replyText });
                    localStorage.setItem("discussions", JSON.stringify(discussions));
                    loadComments(chapter);
                }
            });
        });
    }

    submitComment.addEventListener("click", () => {
        let chapter = chapterSelector.value;
        if (commentName.value.trim() !== "" && commentText.value.trim() !== "") {
            discussions[chapter].push({
                name: commentName.value,
                text: commentText.value,
                replies: []
            });
            localStorage.setItem("discussions", JSON.stringify(discussions));
            commentName.value = "";
            commentText.value = "";
            loadComments(chapter);
        }
    });

    chapterSelector.addEventListener("change", function () {
        loadComments(this.value);
    });

    loadComments("chapter-1"); // Default load
});
