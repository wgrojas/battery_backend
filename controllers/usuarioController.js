const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ==============================
// FUNCIONES AUXILIARES
// ==============================

// Hashear contraseña
const hashPassword = async (contraseña) => {
  return await bcrypt.hash(contraseña, 10);
};

// Verificar contraseña
const comparePassword = async (contraseña, hashedPassword) => {
  return await bcrypt.compare(contraseña, hashedPassword);
};

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
  const { nombre, contraseña } = req.body;
  if (!nombre || !contraseña) 
    return res.status(400).json({ success: false, error: "Faltan datos" });

  try {
    // Verificar si el usuario ya existe
    const sqlCheck = "SELECT * FROM usuarios WHERE nombre = ?";
    db.query(sqlCheck, [nombre], async (err, results) => {
      if (err) return res.status(500).json({ success: false, error: "Error en la base de datos" });

      if (results.length > 0) {
        return res.status(400).json({ success: false, error: "Usuario repetido" });
      }

      // Crear nuevo usuario
      const hashedPassword = await hashPassword(contraseña);
      const sqlInsert = "INSERT INTO usuarios (nombre, contraseña) VALUES (?, ?)";
      db.query(sqlInsert, [nombre, hashedPassword], (err2, result) => {
        if (err2) 
          return res.status(500).json({ success: false, error: "Error al registrar usuario" });
        
        res.json({ success: true, mensaje: "Usuario registrado correctamente" });
      });
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
};

// ==============================
// LOGIN USUARIO
// ==============================
exports.loginUser = (req, res) => {
  const { nombre, contraseña } = req.body;
  if (!nombre || !contraseña) 
    return res.status(400).json({ success: false, error: "Faltan datos" });

  const sql = "SELECT * FROM usuarios WHERE nombre = ?";
  db.query(sql, [nombre], async (err, results) => {
    if (err) return res.status(500).json({ success: false, error: "Error en la base de datos" });
    if (results.length === 0) return res.status(401).json({ success: false, error: "Usuario no encontrado" });

    const user = results[0];
    const match = await comparePassword(contraseña, user.contraseña);
    if (!match) return res.status(401).json({ success: false, error: "Contraseña incorrecta" });

    const token = generateToken(user);
    res.json({ success: true, mensaje: "Login exitoso", token });
  });
};