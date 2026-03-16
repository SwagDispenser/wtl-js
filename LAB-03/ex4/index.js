let arr = [2, 8, 3, 5, 4];
let sum = 0;

for (i = 0; i < arr.length; i++) {
    if (arr[i] % 2 === 0) {
        sum += arr[i];
    }
}

console.log(sum);