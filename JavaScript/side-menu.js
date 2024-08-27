document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const boardTitle = document.querySelector('header h1');
    const editBoardBtn = document.getElementById('edit-board');
    const deleteBoardBtn = document.getElementById('delete-board');
    const newBoardBtn = document.getElementById('new-board');
    
    let isEditing = false;

    // Mostrar/ocultar el menú lateral
    menuToggle.addEventListener('click', () => {
        sideMenu.style.display = sideMenu.style.display === 'block' ? 'none' : 'block';
    });

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
        input.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const newText = input.value.trim();
                if (newText) {
                    if (button === editBoardBtn) {
                        boardTitle.textContent = newText;
                    } else if (button === newBoardBtn) {
                        boardTitle.textContent = newText;
                        // Guardar el nuevo nombre del tablero en localStorage
                        localStorage.setItem('boardTitle', newText);
                        // Refrescar la página para mostrar solo la primera columna
                        location.reload();
                    }
                    button.textContent = button.id === 'edit-board' ? 'Editar Tablero' : 'Nuevo Tablero';
                    sideMenu.style.display = 'none';
                }
            }
        });

        // Guardar cambios al perder el enfoque
        input.addEventListener('blur', () => {
            const newText = input.value.trim();
            if (newText) {
                if (button === editBoardBtn) {
                    boardTitle.textContent = newText;
                } else if (button === newBoardBtn) {
                    boardTitle.textContent = newText;
                    // Guardar el nuevo nombre del tablero en localStorage
                    localStorage.setItem('boardTitle', newText);
                    // Refrescar la página para mostrar solo la primera columna
                    location.reload();
                }
                button.textContent = button.id === 'edit-board' ? 'Editar Tablero' : 'Nuevo Tablero';
                sideMenu.style.display = 'none';
            } else {
                button.textContent = button.id === 'edit-board' ? 'Editar Tablero' : 'Nuevo Tablero';
            }
        });
    };

    // Cargar el nombre del tablero desde localStorage si existe
    const savedTitle = localStorage.getItem('boardTitle');
    if (savedTitle) {
        boardTitle.textContent = savedTitle;
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
        document.querySelector('.lanes').innerHTML = ''; 
        // Restablecer el nombre del tablero al valor por defecto y actualizar localStorage
        boardTitle.textContent = 'Nombre del tablero';
        localStorage.setItem('boardTitle', 'Nombre del tablero');
        sideMenu.style.display = 'none';
    });

    // Ocultar el menú si se hace clic fuera de él
    window.addEventListener('click', (event) => {
        if (!sideMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            sideMenu.style.display = 'none';
        }
    });
});
