const express = require("express")

const router = express.Router()

const controller = require("../controllers/voltajeController")

router.post("/voltaje",controller.recibirVoltaje)

router.get("/datos",controller.obtenerDatos)

module.exports = router