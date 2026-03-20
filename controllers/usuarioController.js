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
// OBTENER TODOS LOS USUARIOS
// ==============================
exports.obtenerUsuarios = async (req, res) => {
  try {
    console.log("📋 Consultando usuarios...");
    const [result] = await db.query("SELECT * FROM usuarios");
    res.json(result);
  } catch (err) {
    console.error("Error consultando usuarios:", err);
    res.status(500).json({ error: err.message });
  }
};

// ==============================
// REGISTRAR USUARIO
// ==============================
exports.registerUser = async (req, res) => {
  const { nombre, password } = req.body;

  if (!nombre || !password) {
    return res.status(400).json({ success: false, error: "Faltan datos" });
  }

  try {

    const [results] = await db.query(
      "SELECT * FROM usuarios WHERE nombre = ?",
      [nombre]
    );

    if (results.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Usuario repetido"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO usuarios (nombre, password) VALUES (?, ?)",
      [nombre, hashedPassword]
    );

    res.json({
      success: true,
      mensaje: "Usuario registrado correctamente"
    });

  } catch (err) {

    console.error("❌ Error al registrar usuario:", err);

    res.status(500).json({
      success: false,
      error: "Error de conexión a la base de datos"
    });

  }
};


// ==============================
// LOGIN USUARIO
// ==============================
exports.loginUser = async (req, res) => {

  const { nombre, password } = req.body;

  if (!nombre || !password) {
    return res.status(400).json({
      success: false,
      error: "Faltan datos"
    });
  }

  try {

    const [results] = await db.query(
      "SELECT * FROM usuarios WHERE nombre = ?",
      [nombre]
    );

    // ❌ Usuario no existe
    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Usuario o contraseña incorrectos"
      });
    }

    const user = results[0];

    // ❌ Usuario sin password
    if (!user.password) {
      return res.status(500).json({
        success: false,
        error: "Error en la base de datos"
      });
    }

    const match = await bcrypt.compare(password, user.password);

    // ❌ Password incorrecta
    if (!match) {
      return res.status(401).json({
        success: false,
        error: "Usuario o contraseña incorrectos"
      });
    }

    // ✅ Login correcto
    const token = generateToken(user);

    res.json({
      success: true,
      mensaje: "Login exitoso",
      token,
      usuario: user.nombre
    });

  } catch (err) {

    console.error("❌ Error en login:", err);

    res.status(500).json({
      success: false,
      error: "Error de conexión a la base de datos"
    });

  }
};

// ==============================
// BORRAR USUARIO POR ID
// ==============================
exports.borrarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM usuarios WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    console.log(`Usuario ID ${id} eliminado`);
    res.json({ mensaje: "Usuario eliminado correctamente", id });
  } catch (err) {
    console.error("Error borrando usuario:", err);
    res.status(500).json({ error: err.message });
  }
};

// ==============================
// ACTUALIZAR USUARIO POR ID
// ==============================
exports.actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, contraseña, rol } = req.body; // por ejemplo, rol puede ser 'admin' o 'usuario'

  try {
    const [result] = await db.query(
      `UPDATE usuarios 
       SET nombre = ?, contraseña = ?, rol = ?
       WHERE id = ?`,
      [nombre, contraseña, rol, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    console.log(`Usuario ID ${id} actualizado`);
    res.json({
      mensaje: "Usuario actualizado correctamente",
      id,
      nombre,
      rol
    });
  } catch (err) {
    console.error("Error actualizando usuario:", err);
    res.status(500).json({ error: err.message });
  }
};