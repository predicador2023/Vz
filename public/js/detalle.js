// detalle.js
async function cargarHistoria() {
  // Detectar si estamos en Live Server (5500) o en Express (4001)
  const baseURL = window.location.port === "5500"
    ? "http://localhost:4001"
    : "";

  // Obtener el parámetro "id" de la URL (ej: detalle.html?id=1)
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.querySelector(".contenido").innerHTML =
      "<p>No se especificó ninguna historia.</p>";
    return;
  }

  try {
    // Pedir la historia al backend
    const res = await fetch(`${baseURL}/historias/${id}`);
    if (!res.ok) throw new Error("Error al obtener la historia");

    const h = await res.json();

    // Insertar datos en el HTML
    document.querySelector(".titulo").textContent = h.titulo || "Sin título";
    document.querySelector(".fecha").textContent = h.fecha || "Fecha no disponible";
    document.querySelector(".contenido").innerHTML =
      h.contenido || "<p>Relato sin contenido</p>";

    // Evento Compartir
    const shareBtn = document.querySelector(".share-btn");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => compartirHistoria(h));
    }

  } catch (error) {
    console.error(error);
    document.querySelector(".contenido").innerHTML =
      "<p>Error al cargar la historia.</p>";
  }
}

// Ejecutar al cargar la página
cargarHistoria();

// 👉 Función global para compartir
function compartirHistoria(h) {
  if (navigator.share) {
    navigator.share({
      title: h.titulo,
      text: "Mirá esta historia en La Voz del Atril:",
      url: window.location.href
    }).catch(err => console.error("Error al compartir:", err));
  } else {
    alert("Copiá este link para compartir: " + window.location.href);
  }
}