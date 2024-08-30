document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const boardTitle = document.querySelector('header h1');
    const editBoardBtn = document.getElementById('edit-board');
    const deleteBoardBtn = document.getElementById('delete-board');
    const newBoardBtn = document.getElementById('new-board');
    const addColumnBtn = document.getElementById('add-column');
    const lanes = document.querySelector('.lanes');

    let isEditing = false;

    // Mostrar/ocultar el menú lateral
    menuToggle.addEventListener('click', () => {
        sideMenu.classList.toggle('show');
    });

    // Función para añadir eventos a los botones dentro de una columna
    const addColumnEvents = (column) => {
        const deleteLaneBtn = column.querySelector('.delete-lane-btn');
        if (deleteLaneBtn) {
            deleteLaneBtn.addEventListener('click', () => {
                column.remove();
            });
        }

        const addTaskBtn = column.querySelector('.add-task-btn');
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => {
                const taskContainer = column.querySelector('.cards-container');
                const taskInput = document.createElement('input');
                taskInput.type = 'text';
                taskInput.placeholder = 'Nueva tarea';
                taskContainer.appendChild(taskInput);
                taskInput.focus();

                taskInput.addEventListener('keypress', (event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        const taskText = taskInput.value.trim();
                        if (taskText) {
                            const taskElement = document.createElement('div');
                            taskElement.className = 'task';
                            taskElement.textContent = taskText;
                            taskContainer.appendChild(taskElement);
                            taskInput.remove();
                        }
                    }
                });

                taskInput.addEventListener('blur', () => {
                    const taskText = taskInput.value.trim();
                    if (taskText) {
                        const taskElement = document.createElement('div');
                        taskElement.className = 'task';
                        taskElement.textContent = taskText;
                        taskContainer.appendChild(taskElement);
                    }
                    taskInput.remove();
                });
            });
        }

        column.querySelectorAll('.task').forEach(task => {
            task.addEventListener('click', () => {
                const taskText = prompt('Edita la tarea:', task.textContent);
                if (taskText !== null) {
                    task.textContent = taskText;
                }
            });
        });
    };

    // Función para iniciar el modo de edición en línea
    const startEditing = (button, initialText, isNewBoard) => {
        button.innerHTML = `
            <div class="editable">
                <input type="text" value="${initialText}" />
            </div>
        `;
        const input = button.querySelector('input');
        input.focus();

        const saveChanges = () => {
            const newText = input.value.trim();
            if (newText) {
                if (button === editBoardBtn) {
                    boardTitle.textContent = newText;
                    localStorage.setItem('boardTitle', newText);
                } else if (button === newBoardBtn) {
                    boardTitle.textContent = newText;
                    localStorage.setItem('boardTitle', newText);

                    // Eliminar todas las columnas excepto la primera y limpiar tareas
                    const columns = lanes.querySelectorAll('.swin-lane');
                    if (columns.length > 0) {
                        columns.forEach((column, index) => {
                            if (index > 0) { // Mantener solo la primera columna
                                column.remove();
                            } else {
                                // Limpiar las tareas de la primera columna
                                const taskContainer = column.querySelector('.cards-container');
                                taskContainer.innerHTML = ''; // Limpiar tareas
                            }
                        });
                    } else {
                        // Si no hay columnas, añadir una inicial
                        const initialColumn = document.createElement('div');
                        initialColumn.className = 'swin-lane';
                        initialColumn.innerHTML = `
                            <h3 class="heading">Ingresar Nombre</h3>
                            <div class="cards-container" aria-live="polite"></div>
                            <button class="delete-lane-btn" aria-label="Eliminar columna">
                                <i class="fas fa-trash" aria-hidden="true"></i>
                            </button>
                            <button class="add-task-btn" aria-label="Agregar tarea">
                                <i class="fas fa-plus" aria-hidden="true"></i>
                            </button>
                        `;
                        lanes.appendChild(initialColumn);
                        addColumnEvents(initialColumn);
                    }
                }
                button.textContent = button.id === 'edit-board' ? 'Editar Tablero' : 'Nuevo Tablero';
                sideMenu.classList.remove('show'); // Ocultar el menú
                isEditing = false; // Finalizar edición
            } else {
                button.textContent = button.id === 'edit-board' ? 'Editar Tablero' : 'Nuevo Tablero';
            }
        };

        input.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                saveChanges();
            }
        });

        input.addEventListener('blur', saveChanges);
    };

    // Cargar el nombre del tablero desde localStorage si existe
    const savedTitle = localStorage.getItem('boardTitle');
    if (savedTitle) {
        boardTitle.textContent = savedTitle;
    }

    // Verificar si hay columnas en la página y añadir una inicial si no existe
    if (!document.querySelector('.swin-lane')) {
        const initialColumn = document.createElement('div');
        initialColumn.className = 'swin-lane';
        initialColumn.innerHTML = `
            <h3 class="heading">Ingresar Nombre</h3>
            <div class="cards-container" aria-live="polite"></div>
            <button class="delete-lane-btn" aria-label="Eliminar columna">
                <i class="fas fa-trash" aria-hidden="true"></i>
            </button>
            <button class="add-task-btn" aria-label="Agregar tarea">
                <i class="fas fa-plus" aria-hidden="true"></i>
            </button>
        `;
        lanes.appendChild(initialColumn);
        addColumnEvents(initialColumn);
    }

    // Editar el tablero
    editBoardBtn.addEventListener('click', () => {
        if (!isEditing) {
            isEditing = true;
            startEditing(editBoardBtn, boardTitle.textContent.trim(), false);
        }
    });

    // Crear un nuevo tablero
    newBoardBtn.addEventListener('click', () => {
        if (!isEditing) {
            isEditing = true;
            startEditing(newBoardBtn, '', true); // Vacío por defecto para nuevo tablero
        }
    });

    // Eliminar el tablero
    deleteBoardBtn.addEventListener('click', () => {
        // Eliminar todas las columnas excepto la primera y limpiar tareas
        const columns = lanes.querySelectorAll('.swin-lane');
        if (columns.length > 0) {
            columns.forEach((column, index) => {
                if (index > 0) { // Mantener solo la primera columna
                    column.remove();
                } else {
                    // Limpiar las tareas de la primera columna
                    const taskContainer = column.querySelector('.cards-container');
                    taskContainer.innerHTML = ''; // Limpiar tareas
                }
            });
        }
        boardTitle.textContent = 'Nombre del tablero';
        localStorage.setItem('boardTitle', 'Nombre del tablero');
        sideMenu.classList.remove('show'); // Ocultar el menú
    });

    // Agregar una nueva columna
    addColumnBtn.addEventListener('click', () => {
        const newColumn = document.createElement('div');
        newColumn.className = 'swin-lane';
        newColumn.innerHTML = `
            <h3 class="heading">Ingresar Nombre</h3>
            <div class="cards-container" aria-live="polite"></div>
            <button class="delete-lane-btn" aria-label="Eliminar columna">
                <i class="fas fa-trash" aria-hidden="true"></i>
            </button>
            <button class="add-task-btn" aria-label="Agregar tarea">
                <i class="fas fa-plus" aria-hidden="true"></i>
            </button>
        `;
        lanes.appendChild(newColumn);
        addColumnEvents(newColumn);
    });

    // Ocultar el menú si se hace clic fuera de él
    window.addEventListener('click', (event) => {
        if (!sideMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            sideMenu.classList.remove('show'); // Ocultar el menú
        }
    });
});
