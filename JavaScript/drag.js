document.addEventListener('DOMContentLoaded', () => {
    setupDragAndDrop();

    const lanesContainer = document.querySelector('.lanes');
    let laneCount = document.querySelectorAll('.swin-lane').length;

    // Añadir botón de eliminar, agregar tarea y agregar columna a las columnas existentes
    document.querySelectorAll('.swin-lane').forEach(lane => {
        addDeleteButton(lane);
        setupTaskButton(lane);
        addAddColumnButton(lane);
        makeEditable(lane.querySelector('.heading')); // Hacer el título editable
    });

    function createNewLane(count) {
        const newLane = document.createElement('div');
        newLane.classList.add('swin-lane');
        newLane.id = `lane-${count}`;
        newLane.setAttribute('draggable', 'true');

        const colorIndex = (count - 1) % colors.length;
        newLane.style.backgroundColor = colors[colorIndex];

        const heading = document.createElement('h3');
        heading.classList.add('heading');
        heading.textContent = 'Ingresar Nombre';
        newLane.appendChild(heading);

        const cardsContainer = document.createElement('div');
        cardsContainer.classList.add('cards-container');
        cardsContainer.id = `cards-${count}`;
        newLane.appendChild(cardsContainer);

        // Crear y añadir botón de eliminar, agregar tarea y agregar columna
        addDeleteButton(newLane);
        setupTaskButton(newLane);
        addAddColumnButton(newLane);

        makeEditable(heading); // Hacer el título editable

        return newLane;
    }

    function addAddColumnButton(lane) {
        const addColumnButton = document.createElement('button');
        addColumnButton.classList.add('add-column-btn');
        addColumnButton.textContent = '+';

        addColumnButton.addEventListener('click', () => {
            laneCount++;
            const newLane = createNewLane(laneCount);
            lanesContainer.appendChild(newLane);
            repositionAddColumnButtons(); // Asegúrate de que los botones de agregar columna estén en la esquina
            setupDragAndDrop(); // Reconfigura el arrastre y la suelta
        });

        lane.appendChild(addColumnButton);
    }

    function addDeleteButton(lane) {
        if (lane.querySelector('.delete-lane-btn')) return;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-lane-btn');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.addEventListener('click', () => {
            lane.remove();
            repositionAddColumnButtons(); // Reubicar los botones de agregar después de eliminar una columna
        });
        lane.appendChild(deleteButton);
    }

    function setupTaskButton(lane) {
        if (lane.querySelector('.add-task-btn')) return;

        const taskButton = document.createElement('button');
        taskButton.classList.add('add-task-btn');
        taskButton.textContent = 'Agregar Tarea';

        taskButton.addEventListener('click', () => {
            const inputContainer = document.createElement('div');
            inputContainer.classList.add('task-input-container');

            const taskInput = document.createElement('input');
            taskInput.classList.add('task-input');
            taskInput.placeholder = 'Introduce el nombre de la tarea';
            taskInput.type = 'text';
            taskInput.autofocus = true;

            inputContainer.appendChild(taskInput);
            lane.insertBefore(inputContainer, taskButton); // Insertar el input al inicio

            // Crear tarea al salir del campo de entrada
            taskInput.addEventListener('blur', () => {
                const taskText = taskInput.value.trim();
                if (taskText) {
                    const taskElement = createTaskElement(taskText);
                    const tasksContainer = lane.querySelector('.cards-container');
                    tasksContainer.appendChild(taskElement);
                    setupDragAndDrop(); // Configura el arrastre y la suelta para la nueva tarea
                }
                inputContainer.remove(); // Elimina el recuadro de entrada después de agregar la tarea
            });

            // Crear tarea cuando se presiona Enter en el campo de entrada
            taskInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    taskInput.blur(); // Activa el evento blur para agregar la tarea
                }
            });
        });

        lane.appendChild(taskButton);
    }

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

    function startEditing(taskContainer) {
        const taskText = taskContainer.querySelector('.task');
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = taskText.textContent;
        editInput.className = 'edit-input';

        taskContainer.classList.add('edit-mode');
        taskText.replaceWith(editInput);
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

    function makeEditable(element) {
        element.addEventListener('click', () => {
            if (!element.classList.contains('editing')) {
                const currentText = element.textContent;
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentText;
                input.className = 'edit-input';
                
                element.classList.add('editing');
                element.replaceWith(input);
                input.focus();
                
                input.addEventListener('blur', () => {
                    const newText = input.value.trim();
                    element.textContent = newText ? newText : currentText;
                    element.classList.remove('editing');
                    input.replaceWith(element);
                });
                
                input.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        input.blur();
                    }
                });
            }
        });
    }

    function setupDragAndDrop() {
        const tasks = document.querySelectorAll('.task-container');
        const lanes = document.querySelectorAll('.swin-lane');

        tasks.forEach(task => {
            task.addEventListener('dragstart', handleDragStart);
            task.addEventListener('dragend', handleDragEnd);
        });

        lanes.forEach(lane => {
            lane.addEventListener('dragover', handleDragOver);
            lane.addEventListener('drop', handleDrop);
        });
    }

    function handleDragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.id);
        event.target.classList.add('dragging');
    }

    function handleDragEnd(event) {
        event.target.classList.remove('dragging');
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const taskId = event.dataTransfer.getData('text/plain');
        const task = document.getElementById(taskId);
        const dropTarget = event.currentTarget.querySelector('.cards-container');

        if (dropTarget) {
            dropTarget.appendChild(task);
        }
    }

    // Define los colores de las columnas si es necesario
    const colors = ['#FAD02E', '#F28D35', '#E85D75', '#1B998B'];
});
