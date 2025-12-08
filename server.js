const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();

// Middleware para servir archivos estáticos (frontend en carpeta public)
app.use(express.static(path.join(__dirname, "public")));

// Conexión a la base de datos SQLite
const db = new sqlite3.Database(path.join(__dirname, "Vz.db"));

// Ruta: obtener todas las historias
app.get("/api/historias", (req, res) => {
  db.all("SELECT * FROM historias", [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al obtener historias" });
    }
    res.json(rows);
  });
});

// Ruta: obtener una historia por ID
app.get("/api/historias/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM historias WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al obtener la historia" });
    }
    if (!row) {
      return res.status(404).json({ error: "Historia no encontrada" });
    }
    res.json(row);
  });
});

// Ruta: dar "like" a una historia
app.post("/api/historias/:id/like", (req, res) => {
  const id = req.params.id;
  db.run(
    "UPDATE historias SET likes = COALESCE(likes, 0) + 1 WHERE id = ?",
    [id],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al actualizar likes" });
      }
      db.get("SELECT likes FROM historias WHERE id = ?", [id], (err, row) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error al obtener likes" });
        }
        res.json({ likes: row.likes });
      });
    }
  );
});

// 👉 Exportar para Vercel
module.exports = app;

// 👉 Si se ejecuta localmente, levantar servidor en puerto 4001
if (require.main === module) {
  const PORT = process.env.PORT || 4001;
  app.listen(PORT, () => {
    console.log(`Servidor local corriendo en http://localhost:${PORT}`);
  });
}