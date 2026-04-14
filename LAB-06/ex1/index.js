let products = [];
let filter = 'all';
let sortType = null;
let editId = null;

const pureAdd = (list, item) => [...list, item];
const pureDelete = (list, id) => list.filter(p => p.id !== id);
const pureUpdate = (list, item) =>
    list.map(p => p.id === item.id ? item : p);

const calcTotal = list =>
    list.reduce((s,p)=>s+Number(p.price),0);

const toast = msg => {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(()=>t.classList.remove("show"),1500);
};

const render = () => {
    let data = [...products];

    if (filter !== 'all')
        data = data.filter(p => p.category === filter);

    if (sortType === 'price')
        data.sort((a,b)=>a.price-b.price);

    if (sortType === 'created')
        data.sort((a,b)=>a.created-b.created);

    if (sortType === 'updated')
        data.sort((a,b)=>a.updated-b.updated);

    const list = document.getElementById("list");
    list.innerHTML = '';

    document.getElementById("empty").style.display =
        data.length ? "none" : "block";

    data.forEach(p => {
        const el = document.createElement("div");
        el.className = "card";

        el.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <p>ID: ${p.id}</p>
      <p>${p.name}</p>
      <p>${p.price} грн</p>
      <p>${p.category}</p>
      <button onclick="edit(${p.id})">Редагувати</button>
      <button onclick="remove(${p.id})">Видалити</button>
    `;

        list.appendChild(el);
    });

    document.getElementById("total").textContent = calcTotal(products);
};

const openModal = () =>
    document.getElementById("modal").classList.add("active");

const closeModal = () => {
    document.getElementById("modal").classList.remove("active");
    form.reset();
    editId = null;
};

form.onsubmit = e => {
    e.preventDefault();

    const item = {
        id: editId || Date.now(),
        name: name.value,
        price: +price.value,
        category: category.value,
        image: image.value,
        created: editId ? products.find(p=>p.id===editId).created : Date.now(),
        updated: Date.now()
    };

    if (editId) {
        products = pureUpdate(products, item);
        toast("Оновлено");
    } else {
        products = pureAdd(products, item);
        toast("Додано");
    }

    closeModal();
    render();
};

const remove = id => {
    products = pureDelete(products, id);
    render();
    toast("Видалено");
};

const edit = id => {
    const p = products.find(p=>p.id===id);
    editId = id;

    name.value = p.name;
    price.value = p.price;
    category.value = p.category;
    image.value = p.image;

    openModal();
};

const setFilter = f => {
    filter = f;
    render();
};

const sortBy = t => {
    sortType = t;
    render();
};

const resetSort = () => {
    sortType = null;
    render();
};

render();