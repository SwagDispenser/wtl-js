function startClock() {
    let clock = document.getElementById("clock");
    let showColon = true;

    setInterval(() => {
        let now = new Date();

        let h = String(now.getHours()).padStart(2, '0');
        let m = String(now.getMinutes()).padStart(2, '0');
        let s = String(now.getSeconds()).padStart(2, '0');

        showColon = !showColon;

        clock.innerHTML = `${h}${showColon ? ':' : ' '} ${m}${showColon ? ':' : ' '} ${s}`;
    }, 1000);
}

function startCountdown() {
    let target = new Date(document.getElementById("targetDate").value);

    let interval = setInterval(() => {
        let now = new Date();
        let diff = target - now;

        if (diff <= 0) {
            document.getElementById("countdown").innerText = "Час вийшов!";
            clearInterval(interval);
            return;
        }

        let sec = Math.floor(diff / 1000) % 60;
        let min = Math.floor(diff / 1000 / 60) % 60;
        let hrs = Math.floor(diff / 1000 / 60 / 60) % 24;
        let days = Math.floor(diff / 1000 / 60 / 60 / 24);

        document.getElementById("countdown").innerText =
            `${days} днів ${hrs} год ${min} хв ${sec} сек`;
    }, 1000);
}

function renderCalendar() {
    let input = document.getElementById("monthPicker").value;

    if (!input) return;

    let [year, month] = input.split("-");
    month = parseInt(month) - 1;

    let firstDay = new Date(year, month, 1).getDay();
    let daysInMonth = new Date(year, month + 1, 0).getDate();

    let table = "<table><tr>";
    let days = ["Нд","Пн","Вт","Ср","Чт","Пт","Сб"];

    days.forEach(d => table += `<th>${d}</th>`);
    table += "</tr><tr>";

    for (let i = 0; i < firstDay; i++) {
        table += "<td></td>";
    }

    for (let d = 1; d <= daysInMonth; d++) {
        if ((firstDay + d - 1) % 7 === 0) table += "</tr><tr>";
        table += `<td>${d}</td>`;
    }

    table += "</tr></table>";

    document.getElementById("calendar").innerHTML = table;
}

function calculateBirthday() {
    let bday = new Date(document.getElementById("birthday").value);
    let now = new Date();

    bday.setFullYear(now.getFullYear());

    if (bday < now) {
        bday.setFullYear(now.getFullYear() + 1);
    }

    let diff = bday - now;

    let sec = Math.floor(diff / 1000) % 60;
    let min = Math.floor(diff / 1000 / 60) % 60;
    let hrs = Math.floor(diff / 1000 / 60 / 60) % 24;
    let days = Math.floor(diff / 1000 / 60 / 60 / 24);
    let months = Math.floor(days / 30);

    document.getElementById("birthdayResult").innerText =
        `${months} міс ${days} днів ${hrs} год ${min} хв ${sec} сек`;
}

startClock();