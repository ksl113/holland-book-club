// script.js
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("submit-book-form").addEventListener("submit", function(event) {
        event.preventDefault();
        const title = document.getElementById("book-title").value;
        const author = document.getElementById("book-author").value;
        const reason = document.getElementById("book-reason").value;
        alert(`Book Submitted:\nTitle: ${title}\nAuthor: ${author}\nReason: ${reason}`);
        this.reset();
    });
});
