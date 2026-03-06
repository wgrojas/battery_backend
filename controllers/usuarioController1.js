const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ==============================
// CREAR USUARIO ADMIN AUTOMÁTICO
// ==============================
(async () => {
  try {
    const adminNombre = "admin";
    const adminContraseña = "12345";

    // Revisar si el usuario admin ya existe
    db.query("SELECT * FROM usuarios WHERE nombre = ?", [adminNombre], async (err, results) => {
      if (err) {
        console.log("❌ Error al verificar usuario admin:", err);
        return;
      }

      if (results.length === 0) {
        // No existe, crearlo con bcrypt
        const hashedPassword = await bcrypt.hash(adminContraseña, 10);
        db.query(
          "INSERT INTO usuarios (nombre, contraseña) VALUES (?, ?)",
          [adminNombre, hashedPassword],
          (err) => {
            if (err) console.log("❌ Error al crear usuario admin:", err);
            else console.log("✅ Usuario admin creado automáticamente con contraseña 12345");
          }
        );
      } else {
        console.log("ℹ️ Usuario admin ya existe, no se crea nuevamente");
      }
    });
  } catch (err) {
    console.log("❌ Error al crear usuario admin:", err);
  }
})();

// ==============================
// Registrar usuario
// ==============================
exports.registerUser = async (req, res) => {
  const { nombre, contraseña } = req.body;
  if (!nombre || !contraseña) return res.status(400).json({ error: "Faltan datos" });

  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const sql = "INSERT INTO usuarios (nombre, contraseña) VALUES (?, ?)";
    db.query(sql, [nombre, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: "Error al registrar usuario" });
      res.json({ success: true, mensaje: "Usuario registrado correctamente" });
    });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// ==============================
// Login usuario
// ==============================
exports.loginUser = (req, res) => {
  const { nombre, contraseña } = req.body;
  if (!nombre || !contraseña) return res.status(400).json({ error: "Faltan datos" });

  const sql = "SELECT * FROM usuarios WHERE nombre = ?";
  db.query(sql, [nombre], async (err, results) => {
    if (err) return res.status(500).json({ error: "Error en la base de datos" });
    if (results.length === 0) return res.status(401).json({ error: "Usuario no encontrado" });

    const user = results[0];
    const match = await bcrypt.compare(contraseña, user.contraseña);
    if (!match) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user.id, nombre: user.nombre },
      process.env.JWT_SECRET || "SECRETO",
      { expiresIn: "1h" }
    );

    res.json({ success: true, mensaje: "Login exitoso", token });
  });
};