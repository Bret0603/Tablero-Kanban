document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const todoLane = document.getElementById('todo-lane');
    const doingLane = document.getElementById('doing-lane');
    const doneLane = document.getElementById('done-lane');

    // Manejar el inicio del arrastre
    const handleDragStart = (event) => {
        event.dataTransfer.setData('text/plain', event.target.id);
        event.target.classList.add('is-dragging');
    };

    // Manejar el fin del arrastre
    const handleDragEnd = (event) => {
        event.target.classList.remove('is-dragging');
    };

    // Manejar el arrastre sobre las zonas de suelta
    const handleDragOver = (event) => {
        event.preventDefault();
    };

    // Manejar el evento drop
    const handleDrop = (event) => {
        event.preventDefault();
        const id = event.dataTransfer.getData('text/plain');
        const draggedElement = document.getElementById(id);
        const dropZone = event.target.closest('.swin-lane');

        if (dropZone && draggedElement) {
            dropZone.appendChild(draggedElement);
        }
    };

    // Crear un nuevo elemento de tarea
    const createTaskElement = (taskText) => {
        const taskContainer = document.createElement('div');
        taskContainer.className = 'task-container';
        taskContainer.draggable = true;
        taskContainer.id = `task-${Date.now()}`; // Genera un ID único para cada tarea

        taskContainer.innerHTML = `
            <p class="task">${taskText}</p>
            <button class="edit-btn"><i class="fas fa-edit"></i></button>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;

        taskContainer.addEventListener('dragstart', handleDragStart);
        taskContainer.addEventListener('dragend', handleDragEnd);

        // Agregar eventos a los botones de editar y eliminar
        taskContainer.querySelector('.edit-btn').addEventListener('click', () => startEditing(taskContainer));
        taskContainer.querySelector('.delete-btn').addEventListener('click', () => taskContainer.remove());

        return taskContainer;
    };

    // Manejar la edición de una tarea
    const startEditing = (taskContainer) => {
        const taskText = taskContainer.querySelector('.task');
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = taskText.textContent;
        editInput.className = 'edit-input';

        taskContainer.classList.add('edit-mode');
        taskContainer.querySelector('.task').replaceWith(editInput);
        editInput.focus();

        editInput.addEventListener('blur', () => {
            taskText.textContent = editInput.value.trim();
            taskContainer.classList.remove('edit-mode');
            editInput.replaceWith(taskText);
        });

        editInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                editInput.blur();
            }
        });
    };

    // Agregar una nueva tarea al form
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const taskText = input.value.trim();
        if (taskText) {
            const taskElement = createTaskElement(taskText);
            todoLane.appendChild(taskElement);
            input.value = '';
        }
    });

    // Agregar eventos a las zonas de suelta
    [todoLane, doingLane, doneLane].forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
    });
});
