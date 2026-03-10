require("dotenv").config();
const express = require("express");
const cors = require("cors");

const db = require("./config/db"); // pool de promesas

const voltajeRoutes = require("./routes/voltajeRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");

const app = express();

// =======================
// CORS dinámico: permite local o Netlify
// =======================
const allowedOrigins = [
  "http://localhost:3000", // Cambia el puerto si tu frontend local es distinto
  "https://battery-solar.netlify.app" // Frontend en Netlify
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite requests sin origin (ej: Postman) o si está en allowedOrigins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
};

// Middleware CORS
app.use(cors(corsOptions));

// Middleware JSON
app.use(express.json());

// =======================
// Rutas API
// =======================
app.use("/api", voltajeRoutes);
app.use("/api/usuarios", usuarioRoutes);

// Ruta principal
app.get("/", (req, res) => {
  res.send("🔋 API Monitor Bateria Solar funcionando");
});

// =======================
// VER USUARIOS
// =======================
app.get("/usuarios", async (req, res, next) => {
  try {
    const [result] = await db.query("SELECT * FROM usuarios");
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// =======================
// VER BATERIAS
// =======================
app.get("/datos", async (req, res, next) => {
  try {
    const [result] = await db.query("SELECT * FROM monitoreo_baterias");
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// =======================
// Middleware global de errores (incluye CORS)
// =======================
app.use((err, req, res, next) => {
  // Asegura que siempre se envíen cabeceras CORS
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  console.error("💥 Error:", err.message);
  res.status(err.status || 500).json({ error: err.message });
});

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});