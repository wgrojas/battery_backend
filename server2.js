require("dotenv").config();
const express = require("express");
const cors = require("cors");

const db = require("./config/db"); // pool de promesas

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
app.get("/usuarios", async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM usuarios");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// =======================
// VER BATERIAS
// =======================
app.get("/datos", async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM monitoreo_baterias");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});