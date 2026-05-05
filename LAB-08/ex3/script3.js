document.addEventListener('DOMContentLoaded', () => {
    const tasks = document.querySelectorAll('.task');
    const columns = document.querySelectorAll('.column');

    let draggedTask = null;

    tasks.forEach(task => {
        task.addEventListener('dragstart', dragStart);
        task.addEventListener('dragend', dragEnd);
    });

    columns.forEach(column => {
        column.addEventListener('dragover', dragOver);
        column.addEventListener('dragenter', dragEnter);
        column.addEventListener('dragleave', dragLeave);
        column.addEventListener('drop', drop);
    });

    function dragStart() {
        draggedTask = this;

        setTimeout(() => {
            this.classList.add('dragging');
        }, 0);
    }

    function dragEnd() {
        this.classList.remove('dragging');
        draggedTask = null;
    }

    function dragOver(event) {
        event.preventDefault();
    }

    function dragEnter(event) {
        event.preventDefault();
        this.classList.add('highlight');
    }

    function dragLeave() {
        this.classList.remove('highlight');
    }

    function drop() {
        this.classList.remove('highlight');

        if (draggedTask) {
            this.appendChild(draggedTask);
        }
    }
});