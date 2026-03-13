const bcrypt = require("bcrypt");
const mysql = require("mysql2");

// Configuración de la conexión
const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // Cambia si tu usuario es otro
  password: "",       // Cambia por tu contraseña de MySQL
  database: "solar_monitor",
});

db.connect(async (err) => {
  if (err) return console.log("❌ Error conectando a MySQL:", err);
  console.log("✅ MySQL conectado");

  try {
    const adminNombre = "admin";
    const adminPassword = "12345";

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // 1️⃣ Borrar la tabla si existe
    const dropTableSQL = "DROP TABLE IF EXISTS usuarios";
    db.query(dropTableSQL, (err) => {
      if (err) return console.log("❌ Error borrando tabla:", err);
      console.log("🗑 Tabla 'usuarios' borrada correctamente");

      // 2️⃣ Crear tabla de nuevo SIN columna 'creado_en'
      const createTableSQL = `
        CREATE TABLE usuarios (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nombre VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL
        )
      `;
      db.query(createTableSQL, (err) => {
        if (err) return console.log("❌ Error creando tabla:", err);
        console.log("✅ Tabla 'usuarios' creada correctamente");

        // 3️⃣ Insertar usuario admin
        const insertAdminSQL = "INSERT INTO usuarios (nombre, password) VALUES (?, ?)";
        db.query(insertAdminSQL, [adminNombre, hashedPassword], (err) => {
          if (err) console.log("❌ Error creando usuario admin:", err);
          else console.log(`✅ Usuario admin creado correctamente con password '${adminPassword}'`);
          db.end();
        });
      });
    });
  } catch (err) {
    console.log("❌ Error:", err);
    db.end();
  }
});