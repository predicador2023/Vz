// app.js
async function cargarHistorias() {
  try {
    // Detectar si estamos en Live Server (5500) o en Express (4001)
    const baseURL = window.location.port !== "4001"
  ? "http://localhost:4001"
  : "";

    const res = await fetch(`${baseURL}/historias`);
    if (!res.ok) throw new Error("Error al obtener las historias");

    const historias = await res.json();

    const contenedor = document.querySelector(".contenedorHistorias");
    contenedor.innerHTML = "";

    historias.forEach(h => {
      const card = document.createElement("div");
      card.classList.add("contenedorNuevo");
      card.dataset.id = h.id;

      card.innerHTML = `
        <img src="${h.imagen || ""}" alt="${h.titulo || ""}" class="imgtarjeta">
        <h3>${h.titulo || "Sin título"}</h3>
        <div class="meta">${h.fecha || "Fecha n/d"} – ${h.autor || "Autor n/d"}</div>
        <div class="acciones">
          <button class="like-btn">❤️</button>
          <span class="like-count">${Number(h.likes || 0)}</span>
          <button class="leer-btn">📘 Leer más</button>
          <button class="share-btn">
            <svg class="icono-compartir" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                 viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            Compartir
          </button>
        </div>
      `;

      // Botón Me gusta
      const heart = card.querySelector(".like-btn");
      const countSpan = card.querySelector(".like-count");
      heart.addEventListener("click", async () => {
        const res = await fetch(`${baseURL}/historias/${h.id}/like`, { method: "POST" });
        if (res.ok) {
          countSpan.textContent = parseInt(countSpan.textContent) + 1;
          heart.classList.add("clicked");
        }
      });

      // Botón Leer más
      const leerBtn = card.querySelector(".leer-btn");
      leerBtn.addEventListener("click", () => {
        location.href = `detalle.html?id=${h.id}`;
      });

      // Botón Compartir
      const shareBtn = card.querySelector(".share-btn");
      shareBtn.addEventListener("click", () => compartirHistoria(h));

      // Finalmente, agregar la tarjeta al contenedor
      contenedor.appendChild(card);
    });

  } catch (error) {
    console.error(error);
    document.querySelector(".contenedorHistorias").innerHTML =
      "<p>Error al cargar las historias.</p>";
  }
}

cargarHistorias();


// 👉 La función compartir va aquí, fuera de cargarHistorias
function compartirHistoria(h) {
  if (navigator.share) {
    navigator.share({
      title: h.titulo,
      text: "Mirá esta historia en La Voz del Atril:",
      url: window.location.origin + "/detalle.html?id=" + h.id
    }).catch(err => console.error("Error al compartir:", err));
  } else {
    alert("Copiá este link para compartir: " +
      window.location.origin + "/detalle.html?id=" + h.id);
  }
}