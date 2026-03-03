let number = 8;
let bool;

if (number >=3 && number <=7) {
    bool = true;
    alert(bool);
} else {
    bool = false;
    alert(bool);
}

bool = !bool;
alert("Reverted:" + bool);