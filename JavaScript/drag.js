document.addEventListener('DOMContentLoaded', () => {
    // Configura la funcionalidad de arrastrar y soltar
    setupDragAndDrop();

    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const addLaneButton = document.getElementById('add-lane-btn');
    const lanesContainer = document.querySelector('.lanes');
    let laneCount = document.querySelectorAll('.swin-lane').length;

    // Añadir botón de eliminar a las columnas existentes al cargar la página
    document.querySelectorAll('.swin-lane').forEach(lane => {
        addDeleteButton(lane);
    });

    // Manejar la creación de una nueva tarea
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const taskText = input.value.trim();
        if (taskText) {
            const taskElement = createTaskElement(taskText);
            const todoLane = document.getElementById('todo-lane');
            todoLane.appendChild(taskElement);
            input.value = '';
        }
    });

    // Manejar la creación de una nueva columna
    addLaneButton.addEventListener('click', () => {
        laneCount++;
        const newLane = document.createElement('div');
        newLane.classList.add('swin-lane');
        newLane.id = `lane-${laneCount}`;
        newLane.setAttribute('draggable', 'true');

        const colorIndex = (laneCount - 1) % colors.length;
        newLane.style.backgroundColor = colors[colorIndex];

        const heading = document.createElement('h3');
        heading.classList.add('heading');
        heading.textContent = 'Nueva Columna';
        newLane.appendChild(heading);

        const cardsContainer = document.createElement('div');
        cardsContainer.classList.add('cards-container');
        cardsContainer.id = `cards-${laneCount}`;
        newLane.appendChild(cardsContainer);

        // Crear botón de eliminar
        addDeleteButton(newLane);

        lanesContainer.appendChild(newLane);

        repositionAddLaneButton();
        makeEditable(heading); // Hacer el título de la nueva columna editable
        setupDragAndDrop(); // Reconfigura el arrastre y la suelta
    });

    // Función para añadir botón de eliminar a una columna
    function addDeleteButton(lane) {
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-lane-btn');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.addEventListener('click', () => {
            lane.remove();
            repositionAddLaneButton(); // Reubicar el botón de agregar después de eliminar una columna
        });
        lane.appendChild(deleteButton);
    }

    // Crear un nuevo elemento de tarea
    function createTaskElement(taskText) {
        const taskContainer = document.createElement('div');
        taskContainer.className = 'task-container';
        taskContainer.draggable = true;
        taskContainer.id = `task-${Date.now()}`;

        taskContainer.innerHTML = `
            <p class="task">${taskText}</p>
            <button class="edit-btn"><i class="fas fa-edit"></i></button>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;

        taskContainer.addEventListener('dragstart', handleDragStart);
        taskContainer.addEventListener('dragend', handleDragEnd);

        taskContainer.querySelector('.edit-btn').addEventListener('click', () => startEditing(taskContainer));
        taskContainer.querySelector('.delete-btn').addEventListener('click', () => taskContainer.remove());

        return taskContainer;
    }

    // Manejar la edición de una tarea
    function startEditing(taskContainer) {
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
    }

    // Hacer el encabezado editable
    function makeEditable(element) {
        element.addEventListener('click', () => {
            // Solo convertir a editable si no está en modo edición
            if (!element.classList.contains('editing')) {
                const currentText = element.textContent;
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentText; // Mantener el texto actual en el campo de entrada
                element.textContent = '';
                element.appendChild(input);
                input.focus();
                element.classList.add('editing'); // Marcar el elemento como en modo edición

                input.addEventListener('blur', () => {
                    const newValue = input.value.trim();
                    element.textContent = newValue || currentText;
                    element.classList.remove('editing'); // Quitar el modo edición
                });

                input.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        input.blur();
                    }
                });
            }
        });
    }

    // Configurar la funcionalidad de arrastrar y soltar
    function setupDragAndDrop() {
        const draggables = document.querySelectorAll('.task-container');
        const droppables = document.querySelectorAll('.swin-lane');

        const handleDragStart = (event) => {
            event.dataTransfer.setData('text/plain', event.target.id);
            event.target.classList.add('is-dragging');
        };

        const handleDragEnd = (event) => {
            event.target.classList.remove('is-dragging');
        };

        const handleDragOver = (event) => {
            event.preventDefault();
        };

        const handleDrop = (event) => {
            event.preventDefault();
            const id = event.dataTransfer.getData('text/plain');
            const draggedElement = document.getElementById(id);
            const dropZone = event.target.closest('.swin-lane');

            if (dropZone && draggedElement) {
                dropZone.querySelector('.cards-container').appendChild(draggedElement);
            }
        };

        draggables.forEach(task => {
            task.addEventListener('dragstart', handleDragStart);
            task.addEventListener('dragend', handleDragEnd);
        });

        droppables.forEach(zone => {
            zone.addEventListener('dragover', handleDragOver);
            zone.addEventListener('drop', handleDrop);
        });

        // Hacer que todos los títulos de las columnas existentes sean editables
        document.querySelectorAll('.heading').forEach(makeEditable);
    }

    // Reubicar el botón de agregar al lado de la última columna
    function repositionAddLaneButton() {
        const lanes = document.querySelectorAll('.swin-lane');
        const lastLane = lanes[lanes.length - 1];
        const rect = lastLane.getBoundingClientRect();
        const button = document.getElementById('add-lane-btn');
        
        button.style.top = `${rect.top + window.scrollY}px`;
        button.style.left = `${rect.right + window.scrollX + 10}px`; // Ajusta la distancia a la derecha
    }

    // Reubicar el botón de agregar cuando la página se carga
    repositionAddLaneButton();

    // Colores para las columnas
    const colors = ['#FFDDC1', '#FFABAB', '#FFC3A0', '#D5AAFF', '#6EC1E4'];
});
