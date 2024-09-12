import { supabase } from "../services/supabaseClient.js";
import { getCurrentBoardId, loadBoard } from "./boards.js";
import { openTaskModal, addTaskToDOM } from "./tasks.js";

export let currentCardId = null;

// Agregar tarjeta (card) al DOM
export async function addCardToDOM(card) {
  const cardsContainer = document.getElementById("cardsContainer");

  const cardDiv = document.createElement("div");
  cardDiv.classList.add("column");
  cardDiv.setAttribute("data-id", card.id);

  // Asignar el color almacenado
  if (card.color) {
    cardDiv.style.backgroundColor = card.color;
  }

  const cardHeader = document.createElement("div");
  cardHeader.classList.add("column-header");
  cardHeader.innerHTML = `
    <div class="column-title">
      <h3>${card.title}</h3>
    </div>
    <div class="column-buttons">
      <button class="edit-column" title="Editar Tarjeta"><i class="fas fa-edit"></i></button>
      <button class="delete-column" title="Eliminar Tarjeta"><i class="fas fa-trash"></i></button>
    </div>
  `;

  // Editar tarjeta
  cardHeader.querySelector(".edit-column").addEventListener("click", () => {
    openCardModal("Editar Tarjeta", card.id, card.title, card.color);
  });

  // Eliminar tarjeta
  cardHeader.querySelector(".delete-column").addEventListener("click", () => {
    deleteCard(card.id);
  });

  const tasksContainer = document.createElement("div");
  tasksContainer.classList.add("tasks-container");
  tasksContainer.setAttribute("data-card-id", card.id);

  // Botón para agregar tareas
  const addTaskButton = document.createElement("button");
  addTaskButton.textContent = "Agregar Tarea";
  addTaskButton.classList.add("addTaskButton");
  addTaskButton.setAttribute("data-card-id", card.id);
  addTaskButton.addEventListener("click", () => {
    openTaskModal("Crear Tarea", null, card.id);
  });

  // Habilitar drag and drop en las tareas
  tasksContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  tasksContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    moveTaskToCard(taskId, card.id);
  });

  // Añadir los componentes al contenedor de la tarjeta
  cardDiv.appendChild(cardHeader);
  cardDiv.appendChild(tasksContainer);
  cardDiv.appendChild(addTaskButton); // Añadir el botón de agregar tarea

  cardsContainer.appendChild(cardDiv);

  // Cargar las tareas asociadas a la tarjeta
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("card_id", card.id)
    .order("id", { ascending: true });

  if (error) {
    console.error("Error al cargar tareas:", error);
    return;
  }

  tasks.forEach((task) => {
    addTaskToDOM(task, tasksContainer); // Utilizar la función importada desde tasks.js
  });
}

// Abrir el modal para tarjetas
export function openCardModal(
  title,
  cardId = null,
  cardName = "",
  cardColor = "#ffffff"
) {
  const cardModalTitle = document.getElementById("cardModalTitle");
  const cardNameInput = document.getElementById("cardName");
  const cardColorInput = document.getElementById("cardColor");
  const cardModal = document.getElementById("cardModal");

  cardModalTitle.textContent = title;
  cardNameInput.value = cardName;
  cardColorInput.value = cardColor; // Establecer el color
  currentCardId = cardId;
  cardModal.style.display = "block";
}

// Cerrar modal de tarjeta
export function closeCardModal() {
  const cardModal = document.getElementById("cardModal");
  cardModal.style.display = "none";
}

// Guardar tarjeta (card)
export async function saveCard() {
  const cardNameInput = document.getElementById("cardName");
  const cardColorInput = document.getElementById("cardColor");
  const name = cardNameInput.value.trim();
  const color = cardColorInput.value; // Obtener el color

  if (name === "") {
    alert("El nombre de la tarjeta es obligatorio.");
    return;
  }

  const currentBoardId = getCurrentBoardId();

  if (currentCardId) {
    const { data, error } = await supabase
      .from("cards")
      .update({ title: name, color: color }) // Actualizar el color
      .eq("id", currentCardId);

    if (error) {
      console.error("Error al actualizar la tarjeta:", error);
      return;
    }
  } else {
    const { data, error } = await supabase
      .from("cards")
      .insert([{ title: name, color: color, board_id: currentBoardId }]); // Insertar el color

    if (error) {
      console.error("Error al crear la tarjeta:", error);
      return;
    }
  }

  closeCardModal();
  loadBoard(currentBoardId, document.getElementById("boardTitle").textContent);
}

// Eliminar tarjeta
export async function deleteCard(cardId) {
  if (
    !confirm(
      "¿Estás seguro de que deseas eliminar esta tarjeta y todas sus tareas?"
    )
  )
    return;

  // Eliminar tareas asociadas a la tarjeta
  await supabase.from("tasks").delete().eq("card_id", cardId);

  // Eliminar tarjeta
  const { data, error } = await supabase
    .from("cards")
    .delete()
    .eq("id", cardId);

  if (error) {
    console.error("Error al eliminar la tarjeta:", error);
    return;
  }

  const currentBoardId = getCurrentBoardId();
  loadBoard(currentBoardId, document.getElementById("boardTitle").textContent);
}

// Mover tarea a otra tarjeta
export async function moveTaskToCard(taskId, cardId) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ card_id: cardId })
    .eq("id", taskId);

  if (error) {
    console.error("Error al mover la tarea:", error);
    return;
  }

  const currentBoardId = getCurrentBoardId();
  loadBoard(currentBoardId, document.getElementById("boardTitle").textContent);
}
