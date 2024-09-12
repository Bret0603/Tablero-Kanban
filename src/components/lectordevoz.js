let isVoiceEnabled = false;
let currentUtterance = null;

// Función para leer el texto
function readText(text) {
  if (currentUtterance) {
    speechSynthesis.cancel(); // Cancelar cualquier lectura en curso
  }

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = "es-ES"; // Idioma español
  speechSynthesis.speak(currentUtterance);
}

// Función para leer el contenido de un elemento
function readElementContent(element) {
  let text = "";

  // Leer texto del elemento
  if (element.textContent) {
    text += element.textContent;
  }

  // Leer atributo 'alt' para imágenes
  if (element.tagName === "IMG") {
    const altText = element.getAttribute("alt");
    if (altText) {
      text += ` Imagen: ${altText}`;
    }
  }

  // Leer contenido de botones y enlaces
  if (element.tagName === "BUTTON") {
    text = `Botón: ${element.textContent}`;
  } else if (element.tagName === "A") {
    text = `Enlace: ${element.textContent} - URL: ${element.href}`;
  }

  // Leer el valor del selector de color
  if (element.type === "color") {
    const colorValue = element.value;
    text = `Selector de color: ${colorValue}`;
  }

  if (text) {
    readText(text);
  }
}

// Función para manejar el evento mouseover
function handleMouseOver(event) {
  if (isVoiceEnabled) {
    readElementContent(event.target);
  }
}

// Función para manejar el evento mouseout
function handleMouseOut() {
  if (isVoiceEnabled) {
    speechSynthesis.cancel(); // Cancelar lectura al salir del elemento
  }
}

// Función para leer el contenido de los modales
function readModalContent() {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    const modalText = modal.textContent || "";
    if (modalText.trim()) {
      readText(`Contenido del modal: ${modalText}`);
    }
  });
}

// Configurar el botón para activar/desactivar la lectura automática
document.getElementById("toggleVoice").addEventListener("click", () => {
  isVoiceEnabled = !isVoiceEnabled;
  const button = document.getElementById("toggleVoice");
  button.textContent = isVoiceEnabled ? "Desactivar Voz" : "Activar Voz";

  if (isVoiceEnabled) {
    // Leer contenido de modales y elementos interactivos al activar
    readModalContent();
  } else {
    speechSynthesis.cancel(); // Cancelar lectura si se desactiva
  }
});

// Configurar eventos de mouseover y mouseout para toda la página
document.addEventListener("mouseover", handleMouseOver);
document.addEventListener("mouseout", handleMouseOut);
