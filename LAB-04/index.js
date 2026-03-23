function Fruits() {
    console.log("\n Fruits");
    let arrFruits = ['Apple', 'Orange', 'Pomegranate'];
    console.log(arrFruits);
    arrFruits.pop();
    console.log("Deleted last: " + arrFruits);
    arrFruits.unshift("Pineapple");
    console.log("Add pineapple: " + arrFruits);
    arrFruits.sort().reverse();
    console.log("Sorted in reverse: " + arrFruits);
    let index = 1 + arrFruits.indexOf('Apple');
    console.log("Apple: " + index);
}

Fruits();

function Colors() {
    console.log("\n Colors");
    let arrColors = ['red', 'green', 'blue', 'green-blue'];
    console.log(arrColors);
    let longest = arrColors.reduce((a, b) => (a.length > b.length ? a : b));
    let shortest = arrColors.reduce((a, b) => (a.length < b.length ? a : b));
    console.log("Longest: " + longest, "Shortest: " + shortest);
    arrColors = arrColors.filter(color => color.includes("blue"));
    console.log("Filtered: " + arrColors);
    let colorString = arrColors.join(", ");
    console.log("Unified " + colorString);
}

Colors();

function Workers() {
    console.log("\n Workers");
    let arrWorkers = [
        { name: "Andriy", age: 23, work: "Developer" },
        { name: "Cemen", age: 25, work: "Tester" },
        { name: "Dmytro", age: 27, work: "Coffee machine" },
        { name: "Bogdan", age: 24, work: "Developer" },
    ]
    console.log(arrWorkers);
    arrWorkers.sort((a, b) => a.name.localeCompare(b.name));
    console.log("Sorted:", arrWorkers);
    let developers = arrWorkers.filter(worker => worker.work === "Developer");
    console.log("Developers: ", developers);
    arrWorkers = arrWorkers.filter(worker => worker.age <= 25);
    console.log("Deleted older than 25 y.o: ", arrWorkers);
    arrWorkers.push({ name: "Petro", age: 27, work: "Junior Cleaner" });
    console.log("Added new ", arrWorkers);
}

Workers();

function Students() {
    console.log("\n Students");
    let arrStudents = [
        { name: "Oleksiy", age: 18, course: 2 },
        { name: "Ivan", age: 17, course: 1 },
        { name: "Yaroslav", age: 19, course: 3 },
        { name: "Svyatoslav", age: 20, course: 2 },
        { name: "Vyacheslav", age: 21, course: 4 }
    ];
    console.log(arrStudents);
    arrStudents = arrStudents.filter(student => student.name !== "Oleksiy");
    console.log("Oleksiy vidrahovaniy: ", arrStudents);
    arrStudents.push({ name: "Dmytro", age: 17, course: 1 });
    console.log("Dmytro added: ", arrStudents);
    arrStudents.sort((a, b) => b.age - a.age);
    console.log("Sorted by age ", arrStudents);
    let thirdCoursnyk = arrStudents.find(student => student.course === 3);
    console.log("3rd course students ", thirdCoursnyk);
}

Students();

function Numbers() {
    console.log("\n Numbers");
    let arrNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let squaredNumbers = arrNumbers.map(num => num ** 2);
    console.log("Squared: ", squaredNumbers);
    let evenNumbers = arrNumbers.filter(num => num % 2 === 0);
    console.log("Even: ", evenNumbers);
    let sum = arrNumbers.reduce((acc, num) => acc + num);
    console.log("Sum: ", sum);
    let newNumbers = [11, 12, 13, 14, 15];
    arrNumbers = arrNumbers.concat(newNumbers);
    console.log("Concat: ", arrNumbers);
    arrNumbers.splice(0, 3);
    console.log("Splice:", arrNumbers);
}

Numbers();

function libraryManagement() {
        let books = [
            { title: "Dog's Heart", author: "Mykhailo Bulgakov", genre: "Satire", pages: 670, isAvailable: true },
            { title: "Harry Potter", author: "J. K. Rowling", genre: "Fiction", pages: 114, isAvailable: false },
            { title: "Master and Margarite", author: "Mykhailo Bulgakov", genre: "Novel", pages: 500, isAvailable: true }
        ];
        return {
            addBook(title, author, genre, pages) {
                books.push({ title, author, genre, pages, isAvailable: true });
                console.log(`Book "${title}" added.`);
            },
            removeBook(title) {
                books = books.filter(book => book.title !== title);
                console.log(`Book "${title}" deleted.`);
            },
            findBooksByAuthor(author) {
                let foundBooks = books.filter(book => book.author === author);
                console.log(`Search by author: "${author}":`, foundBooks);
                return foundBooks;
            },
            toggleBookAvailability(title, isBorrowed) {
                let book = books.find(book => book.title === title);
                if (book) {
                    book.isAvailable = !isBorrowed;
                    console.log(`Book "${title}" now ${book.isAvailable ? "available" : "taken"}.`);
                }
            },
            sortBooksByPages() {
                books.sort((a, b) => a.pages - b.pages);
                console.log("Sorted by pages", books);
            },
            getBooksStatistics() {
                let totalBooks = books.length;
                let availableBooks = books.filter(book => book.isAvailable).length;
                let borrowedBooks = totalBooks - availableBooks;
                let avgPages = totalBooks ? books.reduce((sum, book) => sum + book.pages, 0) / totalBooks : 0;

                let stats = { totalBooks, availableBooks, borrowedBooks, avgPages };
                console.log("Stats:", stats);
                return stats;
            },
            getBooks() {
                console.log("List of books:", books);
                return books;
            }
        };
}

let library = libraryManagement();
library.addBook("IT", "Steven King", "Horror", 600);
library.removeBook("Dog's Heart");
library.findBooksByAuthor("J. K. Rowling");
library.toggleBookAvailability("Harry Potter", true);
library.sortBooksByPages();
library.getBooks();
library.getBooksStatistics();

function StudentTwo() {
    console.log("\n Student Two");
    let student = {
        name: "Dmytro",
        age: 18,
        course: 2
    };
    console.log(student);
    student.subjects = ["Math", "Java", "Web Technologies"];
    delete student.age;
    console.log("Updated:", student);
}

StudentTwo();




