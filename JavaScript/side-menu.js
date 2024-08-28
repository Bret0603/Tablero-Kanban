document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const boardTitle = document.querySelector('header h1');
    const editBoardBtn = document.getElementById('edit-board');
    const deleteBoardBtn = document.getElementById('delete-board');
    const newBoardBtn = document.getElementById('new-board');
    const baseColumn = document.getElementById('todo-lane'); // La columna base para clonar
    const lanes = document.querySelector('.lanes');

    let isEditing = false;

    // Mostrar/ocultar el menú lateral
    menuToggle.addEventListener('click', () => {
        sideMenu.classList.toggle('show');
    });

    // Función para añadir eventos a los botones dentro de una columna
    const addColumnEvents = (column) => {
        // Manejar evento para el botón de eliminar columna
        const deleteLaneBtn = column.querySelector('.delete-lane-btn');
        deleteLaneBtn.addEventListener('click', () => {
            column.remove();
        });

        // Manejar evento para el botón de agregar tarea
        const addTaskBtn = column.querySelector('.add-task-btn');
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => {
                const taskContainer = column.querySelector('.cards-container');
                const taskInput = document.createElement('input');
                taskInput.type = 'text';
                taskInput.placeholder = 'Nueva tarea';
                taskContainer.appendChild(taskInput);
                taskInput.focus();

                // Guardar tarea al presionar Enter
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

                // Cancelar tarea al perder el enfoque
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

        // Agregar eventos a las tareas existentes
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

        // Guardar cambios al presionar Enter
        const saveChanges = () => {
            const newText = input.value.trim();
            if (newText) {
                if (button === editBoardBtn) {
                    boardTitle.textContent = newText;
                    localStorage.setItem('boardTitle', newText);
                } else if (button === newBoardBtn) {
                    boardTitle.textContent = newText;
                    localStorage.setItem('boardTitle', newText);

                    // Limpiar las columnas existentes excepto la columna base
                    lanes.innerHTML = '';

                    // Clonar la columna base y añadirla
                    const clonedColumn = baseColumn.cloneNode(true);
                    clonedColumn.style.display = 'block'; // Hacer visible la columna clonada
                    lanes.appendChild(clonedColumn);

                    // Añadir eventos a los botones de la columna clonada
                    addColumnEvents(clonedColumn);
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

    // Verificar si hay columnas en el localStorage o en la página
    if (localStorage.getItem('boardTitle') && !document.querySelector('.swin-lane')) {
        // Clonar la columna base y añadirla si no hay columnas
        const initialColumn = baseColumn.cloneNode(true);
        initialColumn.style.display = 'block'; // Hacer visible la columna clonada
        lanes.appendChild(initialColumn);

        // Añadir eventos a los botones de la columna existente
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
        // Eliminar todas las columnas
        lanes.innerHTML = ''; 
        // Restablecer el nombre del tablero al valor por defecto y actualizar localStorage
        boardTitle.textContent = 'Nombre del tablero';
        localStorage.setItem('boardTitle', 'Nombre del tablero');
        sideMenu.classList.remove('show'); // Ocultar el menú
    });

    // Ocultar el menú si se hace clic fuera de él
    window.addEventListener('click', (event) => {
        if (!sideMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            sideMenu.classList.remove('show'); // Ocultar el menú
        }
    });
});
