// app.js
async function cargarHistorias() {
  try {
    // Detectar si estamos en Live Server (5500) o en Express (4001)
    const baseURL = window.location.port === "5500"
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

      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    document.querySelector(".contenedorHistorias").innerHTML =
      "<p>Error al cargar las historias.</p>";
  }
}

cargarHistorias();