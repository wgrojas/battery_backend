const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Hashear password
const hashPassword = (password, callback) => {
  bcrypt.hash(password, 10, callback);
};

// Verificar password
const comparePassword = (password, hashedPassword, callback) => {
  bcrypt.compare(password, hashedPassword, callback);
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
exports.registerUser = (req, res) => {
  const { nombre, password } = req.body; // cambiado a password
  if (!nombre || !password)
    return res.status(400).json({ success: false, error: "Faltan datos" });

  const sqlCheck = "SELECT * FROM usuarios WHERE nombre = ?";
  db.query(sqlCheck, [nombre], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, error: "Error en la base de datos" });

    if (results.length > 0)
      return res
        .status(400)
        .json({ success: false, error: "Usuario repetido" });

    hashPassword(password, (errHash, hashedPassword) => {
      if (errHash)
        return res
          .status(500)
          .json({ success: false, error: "Error al encriptar password" });

      const sqlInsert = "INSERT INTO usuarios (nombre, password) VALUES (?, ?)";
      db.query(sqlInsert, [nombre, hashedPassword], (err2, result) => {
        if (err2)
          return res
            .status(500)
            .json({ success: false, error: "Error al registrar usuario" });

        res.json({ success: true, mensaje: "Usuario registrado correctamente" });
      });
    });
  });
};

// ==============================
// LOGIN USUARIO
// ==============================
exports.loginUser = (req, res) => {
  const { nombre, password } = req.body; // cambiado a password
  if (!nombre || !password)
    return res.status(400).json({ success: false, error: "Faltan datos" });

  const sql = "SELECT * FROM usuarios WHERE nombre = ?";
  db.query(sql, [nombre], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, error: "Error en la base de datos" });

    if (results.length === 0)
      return res
        .status(401)
        .json({ success: false, error: "Usuario no encontrado" });

    const user = results[0];
    comparePassword(password, user.password, (errComp, match) => { // columna cambiada a password
      if (errComp)
        return res
          .status(500)
          .json({ success: false, error: "Error al verificar password" });

      if (!match)
        return res
          .status(401)
          .json({ success: false, error: "Password incorrecta" });

      const token = generateToken(user);
      res.json({ success: true, mensaje: "Login exitoso", token });
    });
  });
};