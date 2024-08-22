// modal.js
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('board-modal');
    const editBtn = document.getElementById('edit-board-btn');
    const closeBtn = document.querySelector('.close-btn');
    const deleteBtn = document.getElementById('delete-board-btn');
    const boardForm = document.getElementById('board-form');

    // Mostrar el modal
    editBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Cerrar el modal cuando se hace clic en el botón de cerrar
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cerrar el modal cuando se hace clic fuera del contenido del modal
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Guardar cambios en el nombre del tablero
    boardForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const boardName = document.getElementById('board-name').value;
        document.querySelector('h1').textContent = boardName; // Cambia el nombre del tablero
        modal.style.display = 'none';
    });

    // Eliminar el tablero
    deleteBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres eliminar el tablero?')) {
            document.querySelector('.board').remove(); // Elimina el tablero
            modal.style.display = 'none';
        }
    });
});
