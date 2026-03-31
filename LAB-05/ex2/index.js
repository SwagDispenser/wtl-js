let red = document.getElementById("red");
let yellow = document.getElementById("yellow");
let green = document.getElementById("green");
let statusText = document.getElementById("status");

let times = {
    red: 5000,
    yellow: 3000,
    green: 7000
};

let current = "red";
let timer;

function clearLights() {
    red.classList.remove("on");
    yellow.classList.remove("on");
    green.classList.remove("on");
}

function setLight(color) {
    clearLights();
    document.getElementById(color).classList.add("on");
    statusText.textContent = "Статус: " + color;
    current = color;
}

function startTraffic() {
    runCycle();
}

function runCycle() {
    setLight("red");

    timer = setTimeout(() => {
        setLight("yellow");

        timer = setTimeout(() => {
            setLight("green");

            timer = setTimeout(() => {
                blinkYellow(3); // 3 рази мигання
            }, times.green);

        }, times.yellow);

    }, times.red);
}

function blinkYellow(timesBlink) {
    clearLights();
    let count = 0;

    let interval = setInterval(() => {
        yellow.classList.toggle("on");
        statusText.textContent = "Статус: миготливий жовтий";

        count++;

        if (count >= timesBlink * 2) {
            clearInterval(interval);
            runCycle(); // повертаємось на червоний
        }
    }, 500);
}

function nextStateManual() {
    clearTimeout(timer);

    if (current === "red") {
        setLight("yellow");
    } else if (current === "yellow") {
        setLight("green");
    } else if (current === "green") {
        blinkYellow(3);
    } else {
        setLight("red");
    }
}

function changeTiming() {
    let r = prompt("Час червоного (сек):", times.red / 1000);
    let y = prompt("Час жовтого (сек):", times.yellow / 1000);
    let g = prompt("Час зеленого (сек):", times.green / 1000);

    if (r) times.red = r * 1000;
    if (y) times.yellow = y * 1000;
    if (g) times.green = g * 1000;
}