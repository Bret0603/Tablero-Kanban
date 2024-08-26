document.addEventListener("DOMContentLoaded", () => {
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

    // Agregar eventos a las zonas de suelta
    [todoLane, doingLane, doneLane].forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
    });
});
