import {
  loadBoards,
  openBoardModal,
  saveBoard,
  closeBoardModal,
  getCurrentBoardId,
} from "../src/components/boards.js";

import {
  openCardModal,
  saveCard,
  closeCardModal,
} from "../src/components/cards.js";

import {
  openTaskModal,
  saveTask,
  closeModal,
} from "../src/components/tasks.js";

// Inicializar eventos generales y cargar tableros al inicio
document.addEventListener("DOMContentLoaded", () => {
  const createBoardButton = document.getElementById("createBoard");
  const saveBoardButton = document.getElementById("saveBoard");
  const closeBoardModalButton = document.getElementById("closeBoardModal");

  const addCardButton = document.getElementById("addCard");
  const saveCardButton = document.getElementById("saveCard");
  const closeCardModalButton = document.getElementById("closeCardModal");

  const saveTaskButton = document.getElementById("saveTask");
  const closeTaskModalButton = document.getElementById("closeTaskModal");

  // Verificar si los elementos existen antes de asignar eventos
  if (createBoardButton) {
    createBoardButton.addEventListener("click", () =>
      openBoardModal("Crear Tablero")
    );
  }

  if (saveBoardButton) {
    saveBoardButton.addEventListener("click", saveBoard);
  }
  if (closeBoardModalButton) {
    closeBoardModalButton.addEventListener("click", closeBoardModal);
  }

  // Eventos relacionados con las tarjetas (cards)
  if (addCardButton) {
    addCardButton.addEventListener("click", () => {
      const currentBoardId = getCurrentBoardId();
      if (!currentBoardId) {
        alert("Selecciona un tablero primero.");
        return;
      }
      openCardModal("Crear Tarjeta");
    });
  }
  if (saveCardButton) {
    saveCardButton.addEventListener("click", saveCard);
  }
  if (closeCardModalButton) {
    closeCardModalButton.addEventListener("click", closeCardModal);
  }

  // Aquí integramos la función openTaskModal cuando se hace clic para agregar una tarea
  const tasksContainer = document.getElementById("cardsContainer");
  if (tasksContainer) {
    tasksContainer.addEventListener("click", (event) => {
      if (event.target.classList.contains("addTaskButton")) {
        const cardId = event.target.getAttribute("data-card-id");
        openTaskModal("Crear Tarea", null, cardId);
      }
    });
  }

  // Eventos relacionados con las tareas (tasks)
  if (saveTaskButton) {
    saveTaskButton.addEventListener("click", saveTask);
  }
  if (closeTaskModalButton) {
    closeTaskModalButton.addEventListener("click", () => {
      closeModal(document.getElementById("taskModal"));
    });
  }

  // Cargar los tableros al inicio
  loadBoards();
});
