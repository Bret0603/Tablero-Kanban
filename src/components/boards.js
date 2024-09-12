import { supabase } from "../services/supabaseClient.js";
import { addCardToDOM } from "./cards.js"; // Asegúrate de importar la función

let currentBoardId = null; // Variable local para mantener el estado del tablero actual

// Cargar los tableros desde la base de datos
export async function loadBoards() {
  const { data: boards, error } = await supabase.from("boards").select("*");
  if (error) {
    console.error("Error al cargar tableros:", error);
    return;
  }

  const boardList = document.getElementById("boardList");
  boardList.innerHTML = "";
  boards.forEach((board) => {
    const li = document.createElement("li");
    li.textContent = board.title;
    li.setAttribute("data-id", board.id);
    li.addEventListener("click", () => {
      loadBoard(board.id, board.title);
    });

    // Crear botones para modificar y eliminar tableros
    const modifyButton = document.createElement("button");
    modifyButton.textContent = "Modificar";
    modifyButton.classList.add("modify-board");
    modifyButton.addEventListener("click", (e) => {
      e.stopPropagation();
      openBoardModal("Modificar Tablero", board.id, board.title);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.classList.add("delete-board");
    deleteButton.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (
        confirm(
          `¿Estás seguro de que deseas eliminar el tablero "${board.title}"?`
        )
      ) {
        await deleteBoard(board.id);
        loadBoards();
      }
    });

    li.appendChild(modifyButton);
    li.appendChild(deleteButton);
    boardList.appendChild(li);
  });
}

// Cargar un tablero específico
export async function loadBoard(boardId, boardTitleText) {
  currentBoardId = boardId; // Actualizar el ID del tablero actual
  const boardTitle = document.getElementById("boardTitle");
  boardTitle.textContent = boardTitleText;
  const cardsContainer = document.getElementById("cardsContainer");
  cardsContainer.innerHTML = "";

  // Cargar tarjetas
  const { data: cards, error } = await supabase
    .from("cards")
    .select("*")
    .eq("board_id", boardId)
    .order("id", { ascending: true });

  if (error) {
    console.error("Error al cargar tarjetas:", error);
    return;
  }

  for (const card of cards) {
    await addCardToDOM(card); // Usar la función importada para agregar las tarjetas al DOM
  }
}

// Obtener el ID del tablero actual
export function getCurrentBoardId() {
  return currentBoardId; // Retornar el ID del tablero actual
}

// Abrir el modal de creación o edición de tablero
export function openBoardModal(
  title = "Crear Tablero",
  boardId = null,
  boardName = ""
) {
  const boardModalTitle = document.getElementById("boardModalTitle");
  const boardNameInput = document.getElementById("boardName");
  const boardModal = document.getElementById("boardModal");

  boardModalTitle.textContent = title;
  boardNameInput.value = boardName || ""; // Establece el valor del campo nombre del tablero
  currentBoardId = boardId; // Guardar el ID del tablero si se va a editar
  boardModal.style.display = "block";
}

// Cerrar el modal de tablero
export function closeBoardModal() {
  const boardModal = document.getElementById("boardModal");
  boardModal.style.display = "none";
}

// Guardar un nuevo tablero o actualizar uno existente en la base de datos
export async function saveBoard() {
  const boardNameInput = document.getElementById("boardName");
  const title = boardNameInput.value.trim();
  if (title === "") {
    alert("El nombre del tablero es obligatorio.");
    return;
  }

  if (currentBoardId) {
    // Actualizar un tablero existente
    const { error } = await supabase
      .from("boards")
      .update({ title })
      .eq("id", currentBoardId);

    if (error) {
      console.error("Error al actualizar el tablero:", error);
      return;
    }
  } else {
    // Crear un nuevo tablero
    const { error } = await supabase.from("boards").insert([{ title }]);

    if (error) {
      console.error("Error al crear el tablero:", error);
      return;
    }
  }

  closeBoardModal();
  loadBoards();
}

// Eliminar un tablero
async function deleteBoard(boardId) {
  // Eliminar las tarjetas asociadas al tablero
  await supabase.from("cards").delete().eq("board_id", boardId);

  // Eliminar el tablero
  const { error } = await supabase.from("boards").delete().eq("id", boardId);

  if (error) {
    console.error("Error al eliminar el tablero:", error);
    return;
  }
}
