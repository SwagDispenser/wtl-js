alert("Hello World");

const buttons = document.querySelectorAll("ul li button");

buttons.forEach(button => {
    button.onmousedown = function () {
        this.textContent = "Дмитро";
    };
});