require("dotenv").config();
const express = require("express");
const cors = require("cors");

const voltajeRoutes = require("./routes/voltajeRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes"); // <-- rutas de login/registro

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api", voltajeRoutes);          // Rutas de voltaje/baterías
app.use("/api/usuarios", usuarioRoutes); // Rutas de login y registro

// Ruta principal
app.get("/", (req, res) => {
  res.send("🔋 API Monitor Solar funcionando");
});

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});