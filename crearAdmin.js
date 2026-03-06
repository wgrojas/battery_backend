const bcrypt = require("bcrypt");
const mysql = require("mysql2");

// Configuración de la conexión
const db = mysql.createConnection({
  host: "localhost",
  user: "root",         // Cambia si tu usuario es otro
  password: "",  // Cambia por tu contraseña de MySQL
  database: "solar_monitor",
});

db.connect((err) => {
  if (err) return console.log("Error conectando a MySQL:", err);
  console.log("✅ MySQL conectado");
});

(async () => {
  try {
    const nombre = "admin";
    const contraseña = "12345";

    // Generar hash de la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Insertar o actualizar usuario
    const sqlCheck = "SELECT * FROM usuarios WHERE nombre = ?";
    db.query(sqlCheck, [nombre], (err, results) => {
      if (err) return console.log(err);

      if (results.length > 0) {
        // Si ya existe, actualizar contraseña
        const sqlUpdate = "UPDATE usuarios SET contraseña = ? WHERE nombre = ?";
        db.query(sqlUpdate, [hashedPassword, nombre], (err) => {
          if (err) console.log(err);
          else console.log("✅ Contraseña del usuario admin actualizada correctamente");
          db.end();
        });
      } else {
        // Si no existe, crear usuario
        const sqlInsert = "INSERT INTO usuarios (nombre, contraseña) VALUES (?, ?)";
        db.query(sqlInsert, [nombre, hashedPassword], (err) => {
          if (err) console.log(err);
          else console.log("✅ Usuario admin creado correctamente");
          db.end();
        });
      }
    });
  } catch (err) {
    console.log("Error generando hash:", err);
    db.end();
  }
})();