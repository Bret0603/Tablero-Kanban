
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const editBoardInput = document.getElementById('edit-board-input');
    const editBoardBtn = document.getElementById('edit-board');
    const deleteBoardBtn = document.getElementById('delete-board');
    const boardTitle = document.querySelector('header h1');

   
    menuToggle.addEventListener('click', () => {
        if (sideMenu.style.display === 'block') {
            sideMenu.style.display = 'none';
        } else {
            sideMenu.style.display = 'block';
        }
    });

    
    editBoardBtn.addEventListener('click', () => {
        const newName = editBoardInput.value.trim();
        if (newName) {
            boardTitle.textContent = newName;
            editBoardInput.value = ''; 
        }
    });


    
    window.addEventListener('click', (event) => {
        if (!sideMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            sideMenu.style.display = 'none';
        }
    });
});
