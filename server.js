require("dotenv").config();
const express = require("express");
const cors = require("cors");

const db = require("./config/db"); // conexión a MySQL

const voltajeRoutes = require("./routes/voltajeRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas API
app.use("/api", voltajeRoutes);
app.use("/api/usuarios", usuarioRoutes);

// Ruta principal
app.get("/", (req, res) => {
  res.send("🔋 API Monitor Bateria Solar funcionando");
});

// =======================
// VER USUARIOS
// =======================

app.get("/usuarios", (req, res) => {

  db.query("SELECT * FROM usuarios", (err, result) => {

    if (err) {
      return res.status(500).json({ error: err });
    }

    res.json(result);

  });

});

// =======================
// VER BATERIAS
// =======================

app.get("/datos", (req, res) => {

  db.query("SELECT * FROM monitoreo_baterias", (err, result) => {

    if (err) {
      return res.status(500).json({ error: err });
    }

    res.json(result);

  });

});

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(" Servidor corriendo en puerto " + PORT);
});