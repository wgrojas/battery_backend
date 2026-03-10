const express = require("express");
const router = express.Router();
const db = require("../config/db");

const { registerUser, loginUser } = require("../controllers/usuarioController");

// ====================
// VER USUARIOS
// ====================

router.get("/usuarios", (req, res) => {

  db.query("SELECT id, nombre FROM usuarios", (err, result) => {

    if (err) {
      return res.status(500).json({ error: err });
    }

    res.json(result);

  });

});

// ====================
// REGISTRO
// ====================

router.post("/register", registerUser);

// ====================
// LOGIN
// ====================

router.post("/login", loginUser);

module.exports = router;