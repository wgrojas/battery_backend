require("dotenv").config();
const express = require("express");
const cors = require("cors");

const db = require("./config/db");

const voltajeRoutes = require("./routes/voltajeRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");

const app = express();

// =======================
// MIDDLEWARE LOG PETICIONES
// =======================
app.use((req, res, next) => {
  console.log(
    `📡 ${new Date().toLocaleTimeString()} | ${req.method} | ${req.originalUrl} | IP: ${req.ip}`
  );
  next();
});

// Middlewares
app.use(cors());
app.use(express.json());

// =======================
// RUTAS API
// =======================
app.use("/api", voltajeRoutes);
app.use("/api/usuarios", usuarioRoutes);

// =======================
// RUTA PRINCIPAL
// =======================
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
    console.error("❌ Error SQL:", err);
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
    console.error("❌ Error SQL:", err);
    res.status(500).json({ error: err.message });
  }
});

// =======================
// PUERTO
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 Servidor corriendo en puerto " + PORT);
});