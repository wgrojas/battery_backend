const db = require("../config/db"); // debe ser pool de promesas
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ==============================
// CREAR USUARIO ADMIN AUTOMÁTICO
// ==============================
(async () => {
  try {
    const adminNombre = "admin";
    const adminPassword = "12345"; // cambiado de contraseña a password

    // Revisar si el usuario admin ya existe
    const [results] = await db.query("SELECT * FROM usuarios WHERE nombre = ?", [adminNombre]);

    if (results.length === 0) {
      // No existe, crearlo con bcrypt
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await db.query(
        "INSERT INTO usuarios (nombre, password) VALUES (?, ?)", // columna cambiada a password
        [adminNombre, hashedPassword]
      );
      console.log("✅ Usuario admin creado automáticamente con password 12345");
    } else {
      console.log("ℹ️ Usuario admin ya existe, no se crea nuevamente");
    }
  } catch (err) {
    console.log("❌ Error al crear usuario admin:", err);
  }
})();

// ==============================
// Registrar usuario
// ==============================
exports.registerUser = async (req, res) => {
  const { nombre, password } = req.body; // cambiado a password
  if (!nombre || !password)
    return res.status(400).json({ error: "Faltan datos" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO usuarios (nombre, password) VALUES (?, ?)"; // columna cambiada a password
    await db.query(sql, [nombre, hashedPassword]);
    res.json({ success: true, mensaje: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("❌ Error al registrar usuario:", err);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

// ==============================
// Login usuario
// ==============================
exports.loginUser = async (req, res) => {
  const { nombre, password } = req.body; // cambiado a password
  if (!nombre || !password)
    return res.status(400).json({ error: "Faltan datos" });

  try {
    const sql = "SELECT * FROM usuarios WHERE nombre = ?";
    const [results] = await db.query(sql, [nombre]);

    if (results.length === 0)
      return res.status(401).json({ error: "Usuario no encontrado" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password); // columna cambiada a password
    if (!match)
      return res.status(401).json({ error: "Password incorrecta" });

    const token = jwt.sign(
      { id: user.id, nombre: user.nombre },
      process.env.JWT_SECRET || "SECRETO",
      { expiresIn: "1h" }
    );

    res.json({ success: true, mensaje: "Login exitoso", token });
  } catch (err) {
    console.error("❌ Error en login:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};