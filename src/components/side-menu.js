document.addEventListener('DOMContentLoaded', () => {
    // Obtén el botón del menú y el menú lateral
    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');

    // Añade un evento de clic al botón del menú
    menuToggle.addEventListener('click', () => {
        // Comprueba si el menú está actualmente expandido
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

        // Alterna el estado del atributo 'aria-expanded'
        menuToggle.setAttribute('aria-expanded', !isExpanded);

        // Alterna la visibilidad del menú lateral
        sideMenu.classList.toggle('show', !isExpanded);
    });

    // Oculta el menú si se hace clic fuera de él
    document.addEventListener('click', (event) => {
        // Verifica si el clic fue fuera del menú y del botón
        if (!sideMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            sideMenu.classList.remove('show');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
});
