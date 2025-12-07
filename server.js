const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const db = new sqlite3.Database("Vz.db");

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

// Ruta para obtener todas las historias
app.get("/historias", (req, res) => {
  db.all("SELECT * FROM historias", (err, rows) => {
    if (err) return res.status(500).send("Error en la base");
    res.json(rows);
  });
});

// Ruta para obtener una historia por id
app.get("/historias/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM historias WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).send("Error en la base");
    if (!row) return res.status(404).send("Historia no encontrada");
    res.json(row);
  });
});

// Ruta para dar like
app.post("/historias/:id/like", (req, res) => {
  const { id } = req.params;
  db.run("UPDATE historias SET likes = likes + 1 WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Like agregado" });
  });
});

app.listen(4001, () => {
  console.log("Servidor corriendo en http://localhost:4001");
});