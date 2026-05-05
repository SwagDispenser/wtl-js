const editBtn = document.getElementById("editBtn");
const hint = document.getElementById("hint");
const grid = document.getElementById("cardsGrid");

let isEditing = false;
let draggedCard = null;
let floatingCard = null;
let placeholder = null;
let offsetX = 0;
let offsetY = 0;

editBtn.addEventListener("click", () => {
    isEditing = !isEditing;

    grid.classList.toggle("editing", isEditing);
    editBtn.classList.toggle("active", isEditing);

    editBtn.textContent = isEditing ? "Готово" : "Редагувати";
    hint.textContent = isEditing
        ? "Перетягніть картки або натисніть × щоб видалити"
        : "Натисніть «Редагувати» для керування картками";
});

grid.addEventListener("click", (event) => {
    if (!isEditing) return;

    const deleteBtn = event.target.closest(".delete-btn");

    if (deleteBtn) {
        const card = deleteBtn.closest(".card");
        card.remove();
    }
});

grid.addEventListener("mousedown", (event) => {
    if (!isEditing) return;
    if (event.target.closest(".delete-btn")) return;

    const card = event.target.closest(".card");

    if (!card || !grid.contains(card)) return;

    draggedCard = card;

    const cardRect = card.getBoundingClientRect();

    offsetX = event.clientX - cardRect.left;
    offsetY = event.clientY - cardRect.top;

    placeholder = document.createElement("div");
    placeholder.className = "placeholder";
    placeholder.style.height = `${cardRect.height}px`;

    card.after(placeholder);

    floatingCard = card.cloneNode(true);
    floatingCard.classList.add("floating-card");
    floatingCard.style.width = `${cardRect.width}px`;
    floatingCard.style.height = `${cardRect.height}px`;

    document.body.appendChild(floatingCard);

    card.classList.add("dragging");

    moveFloatingCard(event.clientX, event.clientY);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
});

function onMouseMove(event) {
    if (!draggedCard || !floatingCard || !placeholder) return;

    const gridRect = grid.getBoundingClientRect();
    const floatingRect = floatingCard.getBoundingClientRect();

    let x = event.clientX - offsetX;
    let y = event.clientY - offsetY;

    const minX = gridRect.left;
    const minY = gridRect.top;
    const maxX = gridRect.right - floatingRect.width;
    const maxY = gridRect.bottom - floatingRect.height;

    x = Math.max(minX, Math.min(x, maxX));
    y = Math.max(minY, Math.min(y, maxY));

    floatingCard.style.left = `${x}px`;
    floatingCard.style.top = `${y}px`;

    const afterElement = getDragAfterElement(event.clientX, event.clientY);

    if (afterElement == null) {
        grid.appendChild(placeholder);
    } else {
        grid.insertBefore(placeholder, afterElement);
    }
}

function onMouseUp() {
    if (!draggedCard || !placeholder) return;

    draggedCard.classList.remove("dragging");
    placeholder.replaceWith(draggedCard);

    if (floatingCard) {
        floatingCard.remove();
    }

    draggedCard = null;
    floatingCard = null;
    placeholder = null;

    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
}

function moveFloatingCard(clientX, clientY) {
    floatingCard.style.left = `${clientX - offsetX}px`;
    floatingCard.style.top = `${clientY - offsetY}px`;
}

function getDragAfterElement(x, y) {
    const cards = [...grid.querySelectorAll(".card:not(.dragging)")];

    return cards.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect();

            const offset = Math.hypot(
                x - (box.left + box.width / 2),
                y - (box.top + box.height / 2)
            );

            if (offset < closest.offset) {
                return {
                    offset,
                    element: child
                };
            }

            return closest;
        },
        {
            offset: Number.POSITIVE_INFINITY,
            element: null
        }
    ).element;
}