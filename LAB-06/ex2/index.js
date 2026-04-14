const state = {
    tasks: []
};

const STATUS = {
    NEW: 'нове',
    PROGRESS: 'в_роботі',
    DONE: 'виконано'
};

const addTask = (tasks, text) => [
    ...tasks,
    {
        id: Date.now(),
        text,
        status: STATUS.NEW,
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
];

const deleteTask = (tasks, id) => tasks.filter(t => t.id !== id);

const updateStatus = (tasks, id, status) =>
    tasks.map(t => t.id === id ? { ...t, status, updatedAt: Date.now() } : t);

const editTask = (tasks, id, newText) =>
    tasks.map(t => t.id === id ? { ...t, text: newText, updatedAt: Date.now() } : t);

const sortTasks = (tasks, type) => {
    const sorted = [...tasks];
    if (type === 'status') {
        const order = { нове: 0, в_роботі: 1, виконано: 2 };
        return sorted.sort((a,b) => order[a.status] - order[b.status]);
    }
    if (type === 'updated') {
        return sorted.sort((a,b) => b.updatedAt - a.updatedAt);
    }
    return sorted.sort((a,b) => b.createdAt - a.createdAt);
};

const render = () => {
    const list = document.getElementById('taskList');
    const sortType = document.getElementById('sortSelect').value;
    const tasks = sortTasks(state.tasks, sortType);

    list.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');

        const left = document.createElement('div');

        const span = document.createElement('span');
        span.textContent = task.text;

        const status = document.createElement('span');
        status.textContent = task.status;
        status.className = `status ${task.status}`;

        left.appendChild(span);
        left.appendChild(status);

        const statusSelect = document.createElement('select');
        statusSelect.innerHTML = `
          <option value="нове">Нове</option>
          <option value="в_роботі">В роботі</option>
          <option value="виконано">Виконано</option>
        `;
        statusSelect.value = task.status;
        statusSelect.onchange = (e) => {
            state.tasks = updateStatus(state.tasks, task.id, e.target.value);
            render();
        };

        const actions = document.createElement('div');
        actions.className = 'actions';

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Редагувати';
        editBtn.className = 'edit';
        editBtn.onclick = () => {
            const newText = prompt('Редагувати завдання:', task.text);
            if (newText && newText.trim().length >= 2) {
                state.tasks = editTask(state.tasks, task.id, newText.trim());
                render();
            }
        };

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Видалити';
        delBtn.onclick = () => {
            state.tasks = deleteTask(state.tasks, task.id);
            render();
        };

        actions.appendChild(editBtn);
        actions.appendChild(delBtn);

        li.appendChild(left);
        li.appendChild(statusSelect);
        li.appendChild(actions);

        list.appendChild(li);
    });
};

document.getElementById('taskForm').addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('taskInput');

    state.tasks = addTask(state.tasks, input.value.trim());
    input.value = '';
    render();
});

document.getElementById('sortSelect').addEventListener('change', render);

render();