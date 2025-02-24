// calendar.js
document.addEventListener("DOMContentLoaded", () => {
    const calendarContainer = document.getElementById("calendar-container");
    
    // Sample events - replace this with a backend fetch or JSON file later
    const events = [
        { date: "2025-03-10", title: "March Meeting - Discuss Chapters 1-5" },
        { date: "2025-04-14", title: "April Meeting - Discuss Chapters 6-10" },
        { date: "2025-05-12", title: "May Meeting - Final Discussion" }
    ];
    
    function generateCalendar(events) {
        let calendarHTML = "<ul>";
        events.forEach(event => {
            calendarHTML += `<li><strong>${event.date}</strong>: ${event.title}</li>`;
        });
        calendarHTML += "</ul>";
        calendarContainer.innerHTML = calendarHTML;
    }
    
    generateCalendar(events);
});
