import { supabase } from "../services/supabaseClient.js";

let currentCardId = null;

// Función para abrir el modal de tarea
export function openTaskModal(title, task = null, cardId = null) {
  const taskModalTitle = document.getElementById("taskModalTitle");
  const taskIdInput = document.getElementById("taskId");
  const taskTitleInput = document.getElementById("taskTitle");
  const taskDescriptionInput = document.getElementById("taskDescription");
  const taskModal = document.getElementById("taskModal");

  taskModalTitle.textContent = title;
  if (task) {
    taskIdInput.value = task.id;
    taskTitleInput.value = task.title;
    taskDescriptionInput.value = task.description;
    currentCardId = task.card_id;
  } else {
    taskIdInput.value = "";
    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
    currentCardId = cardId;
  }
  taskModal.style.display = "block";
}

// Función para cerrar el modal
export function closeModal(modal) {
  modal.style.display = "none";
}

// Guardar tarea (task)
export async function saveTask() {
  const taskTitleInput = document.getElementById("taskTitle");
  const taskDescriptionInput = document.getElementById("taskDescription");
  const taskIdInput = document.getElementById("taskId");
  const taskModal = document.getElementById("taskModal");

  const title = taskTitleInput.value.trim();
  const description = taskDescriptionInput.value.trim();
  const taskId = taskIdInput.value;

  if (title === "") {
    alert("El título de la tarea es obligatorio.");
    return;
  }

  if (taskId) {
    // Actualizar tarea existente
    const { error } = await supabase
      .from("tasks")
      .update({ title, description })
      .eq("id", taskId);

    if (error) {
      console.error("Error al actualizar la tarea:", error);
      return;
    }

    // Actualizar tarea en el DOM después de actualizarla
    const taskDiv = document.querySelector(`[data-id='${taskId}']`);
    taskDiv.querySelector("h4").textContent = title;
    taskDiv.querySelector("p").textContent = description;
  } else {
    // Crear nueva tarea
    const { data, error } = await supabase
      .from("tasks")
      .insert([{ title, description, card_id: currentCardId }])
      .select(); // Añadir .select() para obtener el objeto insertado

    if (error || !data || data.length === 0) {
      console.error("Error al crear la tarea:", error);
      return;
    }

    // Agregar tarea al DOM inmediatamente después de guardarla
    const tasksContainer = document.querySelector(
      `[data-card-id='${currentCardId}']`
    );
    addTaskToDOM(data[0], tasksContainer); // Añadir la tarea creada al DOM
  }

  closeModal(taskModal);
}

// Función para agregar tarea al DOM
export function addTaskToDOM(task, tasksContainer) {
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("task");
  taskDiv.setAttribute("data-id", task.id);
  taskDiv.setAttribute("draggable", "true");

  taskDiv.innerHTML = `
    <div class="task-content">
      <h4>${task.title}</h4>
      <p>${task.description}</p>
    </div>
    <div class="task-buttons">
      <button class="task-button edit-task" title="Editar Tarea"><i class="fas fa-edit"></i></button>
      <button class="task-button delete-task" title="Eliminar Tarea"><i class="fas fa-trash"></i></button>
    </div>
  `;

  // Habilitar drag and drop
  taskDiv.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", task.id);
  });

  // Función para editar la tarea
  taskDiv.querySelector(".edit-task").addEventListener("click", () => {
    openTaskModal("Editar Tarea", task, task.card_id);
  });

  // Función para eliminar la tarea
  taskDiv.querySelector(".delete-task").addEventListener("click", async () => {
    if (confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      await deleteTask(task.id);
      taskDiv.remove(); // Eliminar tarea del DOM
    }
  });

  tasksContainer.appendChild(taskDiv); // Añadir tarea al contenedor
}

// Eliminar tarea (task)
export async function deleteTask(taskId) {
  const { data, error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId);

  if (error) {
    console.error("Error al eliminar la tarea:", error);
    return;
  }
}
