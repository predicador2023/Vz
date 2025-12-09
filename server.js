// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');   // 👉 nuevo

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());                // 👉 habilita CORS
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Ruta para obtener todas las historias
app.get('/historias', (req, res) => {
  const dbPath = path.join(__dirname, 'Vz.db');
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error('Error al abrir la base:', err.message);
      return res.status(500).json({ error: 'No se pudo abrir la base de datos' });
    }
  });

  db.all('SELECT * FROM historias', (err, rows) => {
    if (err) {
      console.error('Error al consultar historias:', err.message);
      res.status(500).json({ error: 'Error al obtener las historias' });
    } else {
      res.json(rows);
    }
    db.close();
  });
});

// Ruta para obtener una historia por ID
app.get('/historias/:id', (req, res) => {
  const dbPath = path.join(__dirname, 'Vz.db');
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);

  const id = req.params.id;
  db.get('SELECT * FROM historias WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error al obtener historia:', err.message);
      res.status(500).json({ error: 'Error al obtener la historia' });
    } else if (!row) {
      res.status(404).json({ error: 'Historia no encontrada' });
    } else {
      res.json(row);
    }
    db.close();
  });
});

// Ruta para dar "like" a una historia
app.post('/historias/:id/like', (req, res) => {
  const dbPath = path.join(__dirname, 'Vz.db');
  const db = new sqlite3.Database(dbPath);

  const id = req.params.id;
  db.run('UPDATE historias SET likes = likes + 1 WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Error al dar like:', err.message);
      res.status(500).json({ error: 'Error al actualizar likes' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Historia no encontrada' });
    } else {
      res.json({ success: true });
    }
    db.close();
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});