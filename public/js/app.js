// app.js
async function cargarHistorias() {
  try {
    // Detectar si estamos en Live Server (5500) o en Express (4001)
  const baseURL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  ? "http://localhost:4001"
  : "";

    const res = await fetch(`${baseURL}/historias`);
    if (!res.ok) throw new Error("Error al obtener las historias");

    const historias = await res.json();

    const contenedor = document.querySelector(".contenedorHistorias");
    contenedor.innerHTML = "";

    historias.forEach(h => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.id = h.id;

    card.innerHTML = `
  <img src="${h.imagen || ''}" alt="${h.titulo || ''}">
  <div class="contenido">
    <h3>${h.titulo || 'Sin título'}</h3>
    <div class="meta">${h.fecha || 'Fecha n/d'} – ${h.autor || 'Autor n/d'}</div>
    <div class="acciones">
      
       <div class="acciones-superior">
        <button class="like-btn">❤️ <span class="like-count">${h.likes || 0}</span></button>
        
        <button class="share-btn">
          <img src="img/share.svg" alt="Compartir">
        </button>

       </div>

      <div class="acciones-inferior">
        <button class="leer-btn">Leer más</button>
      </div>

    </div>
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