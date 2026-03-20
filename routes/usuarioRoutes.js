const express = require("express");
const router = express.Router();
const db = require("../config/db");

const { registerUser, loginUser,obtenerUsuarios,borrarUsuario,actualizarUsuario } = require("../controllers/usuarioController");



// ==============================
// RUTAS USUARIOS
// ==============================

// GET /api/usuarios -> obtener todos los usuarios
router.get("/", obtenerUsuarios);

// DELETE /api/usuarios/:id -> borrar usuario por ID
router.delete("/:id", borrarUsuario);

// PUT /api/usuarios/:id -> actualizar usuario por ID
router.put("/:id", actualizarUsuario);

router.post("/register", registerUser);


router.post("/login", loginUser);

module.exports = router;