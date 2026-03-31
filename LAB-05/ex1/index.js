let lamp = document.getElementById("lamp");
let typeSelect = document.getElementById("type");

let isOn = false;
let timer;

function toggleLamp() {
    resetTimer();

    isOn = !isOn;

    lamp.className = "lamp";
    let type = typeSelect.value;

    if (type !== "normal") {
        lamp.classList.add(type);
    }

    if (isOn) {
        lamp.classList.add("on");
    }
}

function setBrightness() {
    resetTimer();

    let brightness = prompt("Введіть яскравість (0-100):");

    if (brightness !== null) {
        lamp.style.opacity = brightness / 100;
    }
}

function resetTimer() {
    clearTimeout(timer);

    timer = setTimeout(() => {
        isOn = false;
        lamp.className = "lamp";
        alert("Лампочка автоматично вимкнулась!");
    }, 30000);
}