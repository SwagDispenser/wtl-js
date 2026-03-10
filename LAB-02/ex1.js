let arr = [1, 5, 2, 9, 3];
alert(arr);

let max = Math.max.apply(null, arr);
alert(max);

let min = Math.min.apply(null, arr);
alert(min);

let obj1 = {
    name: "Dmytro",
    age: 20
};

let obj2 = {
    name: "Dmytro",
    age: 20
};

// порівняння властивостей
if (obj1.name === obj2.name && obj1.age === obj2.age) {
    alert("Об'єкти однакові");
} else {
    alert("Об'єкти різні");
}
