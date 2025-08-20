// أسماء الأشهر الهجرية
const hijriMonths = [
    "محرم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة",
    "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
];

// دوال التحويل البسيطة (تقريبية، لأغراض العرض فقط)
function gregorianToHijri(gDate) {
    // هذه دالة تقريبية جدا! لعرض اسم الشهر فقط وليس تحويل دقيق للتاريخ الهجري.
    // يمكن استخدام مكتبة دقيقة مثل UmmAlQura أو moment-hijri إن أردت دقة أعلى.
    const startHijriYear = 1446;
    const startGregorian = new Date(2024, 7, 7); // 2 محرم 1446هـ = 7 أغسطس 2024م
    const diffDays = Math.floor((gDate - startGregorian) / (1000 * 60 * 60 * 24));
    let hijriMonth = Math.floor(diffDays / 29.5);
    let hijriYear = startHijriYear;
    while (hijriMonth >= 12) { hijriMonth -= 12; hijriYear++; }
    while (hijriMonth < 0) { hijriMonth += 12; hijriYear--; }
    return { month: hijriMonths[hijriMonth], year: hijriYear };
}

let currentMonth = (new Date()).getMonth();
let currentYear = (new Date()).getFullYear();

function renderCalendar(month, year) {
    const calendarEl = document.getElementById("calendar");
    calendarEl.innerHTML = "";

    const firstDay = (new Date(year, month, 1)).getDay(); // 0=الأحد
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // تحويل الميلادي إلى هجري تقريبي
    const hijriObj = gregorianToHijri(new Date(year, month, 1));

    let table = "<table class='calendar-table'>";
    table += "<thead><tr>";
    table += "<th>الأحد</th><th>الإثنين</th><th>الثلاثاء</th><th>الأربعاء</th><th>الخميس</th><th>الجمعة</th><th>السبت</th>";
    table += "</tr></thead><tbody><tr>";

    let day = 1;
    let started = false;
    for (let i = 0; i < 6; i++) { // 6 أسابيع كحد أقصى
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                table += "<td></td>";
            } else if (day > daysInMonth) {
                table += "<td></td>";
            } else {
                const today = new Date();
                const isToday = (day === today.getDate() && month === today.getMonth() && year === today.getFullYear());
                table += `<td class="${isToday ? "today" : ""}">${day}</td>`;
                day++;
            }
        }
        table += "</tr>";
        if (day > daysInMonth) break;
        if (i < 5) table += "<tr>";
    }
    table += "</tbody></table>";

    calendarEl.innerHTML = `
        <div style="text-align:center;font-weight:bold;margin-bottom:8px;">
            ${hijriObj.month} ${hijriObj.year} هـ (${year}-${month+1})
        </div>
        ${table}
    `;
    document.getElementById("monthYear").textContent = `${hijriObj.month} ${hijriObj.year}`;
}

document.getElementById("prevMonth").onclick = function() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
};
document.getElementById("nextMonth").onclick = function() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
};

// PDF
document.getElementById("downloadPdf").onclick = function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4"
    });
    doc.html(document.getElementById("calendar"), {
        callback: function (pdf) {
            pdf.save("calendar.pdf");
        },
        x: 20, y: 20
    });
};

renderCalendar(currentMonth, currentYear);
