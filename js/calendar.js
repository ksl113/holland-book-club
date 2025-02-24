// calendar.js
document.addEventListener("DOMContentLoaded", () => {
    const calendarContainer = document.getElementById("calendar-container");
    
    function generateCalendar() {
        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const events = {
            "2025-03-10": "March Meeting - Discuss Chapters 1-5",
            "2025-04-14": "April Meeting - Discuss Chapters 6-10",
            "2025-05-12": "May Meeting - Final Discussion"
        };
        
        let calendarHTML = `<table class='calendar'>`;
        calendarHTML += `<tr><th colspan='7'>${today.toLocaleString('default', { month: 'long' })} ${year}</th></tr>`;
        calendarHTML += `<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>`;
        
        let date = 1;
        for (let i = 0; i < 6; i++) {
            calendarHTML += "<tr>";
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    calendarHTML += "<td></td>";
                } else if (date > daysInMonth) {
                    break;
                } else {
                    let currentDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
                    let eventText = events[currentDate] ? `<div class='event'>${events[currentDate]}</div>` : "";
                    calendarHTML += `<td>${date}${eventText}</td>`;
                    date++;
                }
            }
            calendarHTML += "</tr>";
        }
        
        calendarHTML += "</table>";
        calendarContainer.innerHTML = calendarHTML;
    }
    
    generateCalendar();
});

