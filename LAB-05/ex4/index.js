let products = new Map();

let orders = new Set();

let productHistory = new WeakMap();

let activeProducts = new WeakSet();

let idCounter = 1;

function addProduct() {
    let name = prompt("Назва:");
    let price = +prompt("Ціна:");
    let quantity = +prompt("Кількість:");

    let product = { id: idCounter++, name, price, quantity };

    products.set(product.id, product);
    productHistory.set(product, ["Створено"]);
    activeProducts.add(product);

    log("Додано продукт", product);
}

function deleteProduct() {
    let id = +prompt("ID продукту:");

    let product = products.get(id);

    if (product) {
        products.delete(id);
        log("Видалено продукт", product);
    } else {
        log("Продукт не знайдено");
    }
}

function updateProduct() {
    let id = +prompt("ID продукту:");
    let product = products.get(id);

    if (!product) {
        log("Не знайдено");
        return;
    }

    let newPrice = +prompt("Нова ціна:");
    let newQty = +prompt("Нова кількість:");

    product.price = newPrice;
    product.quantity = newQty;

    let history = productHistory.get(product);
    history.push("Оновлено");

    log("Оновлено", product);
}

function findProduct() {
    let name = prompt("Назва продукту:");

    for (let product of products.values()) {
        if (product.name === name) {
            log("Знайдено", product);
            return;
        }
    }

    log("Не знайдено");
}

function makeOrder() {
    let id = +prompt("ID продукту:");
    let qty = +prompt("Кількість:");

    let product = products.get(id);

    if (!product) {
        log("Продукт не існує");
        return;
    }

    if (product.quantity < qty) {
        log("Недостатньо товару");
        return;
    }

    product.quantity -= qty;

    let order = {
        productId: id,
        quantity: qty,
        date: new Date()
    };

    orders.add(order);

    let history = productHistory.get(product);
    history.push("Замовлення: -" + qty);

    log("Замовлення виконано", order);
}

function log(message, data = "") {
    document.getElementById("output").textContent =
        message + "\n" + JSON.stringify(data, null, 2);
}