const express = require("express");
const router = express.Router();

const controller = require("../controllers/voltajeController");

// ==============================
// VOLTAJE
// ==============================

// 👉 API activa
router.get("/voltaje", controller.recibirVoltaje);

// 👉 recibir datos ESP
router.post("/voltaje", controller.recibirVoltaje);

// 👉 obtener datos (30 + mensaje)
router.get("/datos", controller.obtenerDatos);

// 👉 eliminar todo
router.delete("/eliminar", controller.borrarDatos);

// 👉 eliminar por ID
router.delete("/eliminar/:id", controller.borrarDatoPorId);

// 👉 actualizar
router.put("/voltaje/:id", controller.actualizarDato);

module.exports = router;