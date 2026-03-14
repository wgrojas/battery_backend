const db = require("../config/db"); // pool de promesas
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Generar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, nombre: user.nombre },
    process.env.JWT_SECRET || "SECRETO",
    { expiresIn: "1h" }
  );
};

// ==============================
// REGISTRAR USUARIO
// ==============================
exports.registerUser = async (req, res) => {
  const { nombre, password } = req.body; // cambiado de contraseña a password

  if (!nombre || !password) {
    return res.status(400).json({ success: false, error: "Faltan datos" });
  }

  try {
    // Verificar si el usuario ya existe
    const [results] = await db.query("SELECT * FROM usuarios WHERE nombre = ?", [nombre]);
    if (results.length > 0) {
      return res.status(400).json({ success: false, error: "Usuario repetido" });
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    await db.query(
      "INSERT INTO usuarios (nombre, password) VALUES (?, ?)",
      [nombre, hashedPassword]
    );

    res.json({ success: true, mensaje: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("❌ Error al registrar usuario:", err);
    res.status(500).json({ success: false, error: "Error en la base de datos" });
  }
};

// ==============================
// LOGIN USUARIO
// ==============================
exports.loginUser = async (req, res) => {
  const { nombre, password } = req.body; // cambiado de contraseña a password

  if (!nombre || !password) {
    return res.status(400).json({ success: false, error: "Faltan datos" });
  }

  try {
    // Buscar usuario
    const [results] = await db.query("SELECT * FROM usuarios WHERE nombre = ?", [nombre]);
    if (results.length === 0) {
      return res.status(401).json({ success: false, error: "Usuario no encontrado" });
    }

    const user = results[0];

    // Validar que exista hash de password
    if (!user.password) {
      return res.status(500).json({ success: false, error: "Usuario sin password válida" });
    }

    // Verificar password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, error: "Password incorrecta" });
    }

    // Generar token
    const token = generateToken(user);

    // Enviar token y nombre de usuario al frontend
    res.json({ success: true, mensaje: "Login exitoso", token, usuario: user.nombre });
  } catch (err) {
    console.error("❌ Error en login:", err);
    res.status(500).json({ success: false, error: "Error en la base de datos" });
  }
};