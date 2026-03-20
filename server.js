require("dotenv").config();
const express = require("express");
const cors = require("cors");

const db = require("./config/db");

const voltajeRoutes = require("./routes/voltajeRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");

const app = express();

// =======================
// MIDDLEWARES
// =======================
app.use(cors());
app.use(express.json());

// =======================
// RUTAS
// =======================
app.use("/api", voltajeRoutes);
app.use("/api/usuarios", usuarioRoutes);

// =======================
// RUTA PRINCIPAL
// =======================
app.get("/", (req, res) => {
  res.send("🔋 API Monitor Batería Solar funcionando");
});

// =======================
// PRUEBA USUARIOS
// =======================
// app.get("/api/usuarios", async (req, res) => {
//   console.log("📋 Consultando usuarios...");
//   try {
//     const [result] = await db.query("SELECT * FROM usuarios");

//     res.json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// =======================
// PUERTO
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("\n==============================");
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("==============================\n");
});