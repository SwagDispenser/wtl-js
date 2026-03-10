let mark = Number(prompt("Оцінка?"));
let markTrue = (mark >= 1 && mark <= 4);
if (markTrue) {
    switch(mark){
        case 1: alert("НЕЗАДОВІЛЬНО");
        break;

        case 2: alert("Задовільно");
        break;

        case 3: alert("Добре");
        break;

        case 4: alert ("ВІДМІННО");
        break;
    }
} else {
    alert ("Такого балу ще не придумали")
}

let season = Number(prompt("Введіть номер місяця"));
let seasonTrue = (season >= 1 && season <= 12);
seasonTrue
    ? alert (
        (season >= 1 && season <= 2 || season === 12) ? "Зима" :
            (season >= 3 && season <= 5) ? "Весна" :
                (season >= 6 && season <= 8) ? "Літо" :
                    (season >=9 && season <= 11) ? "Осінь" : "" ) : "Немає такого місяця"