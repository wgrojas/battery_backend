require("dotenv").config();
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

async function crearAdmin() {
  try {
    // Parsear DATABASE_URL de PlanetScale
    const url = new URL(process.env.DATABASE_URL);

    const db = await mysql.createConnection({
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.replace("/", ""),
      port: url.port || 3306,
      ssl: { rejectUnauthorized: true },
      charset: "utf8mb4",
    });

    const usuario = "admin";
    const password = "12345"; // contraseña que quieres usar
    const hash = await bcrypt.hash(password, 10);

    // Borrar la tabla si existe
    await db.query("DROP TABLE IF EXISTS usuarios");
    console.log("🗑 Tabla 'usuarios' borrada correctamente");

    // Crear tabla nueva
    await db.query(`
      CREATE TABLE usuarios (
        id INT NOT NULL AUTO_INCREMENT,
        nombre VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log("✅ Tabla 'usuarios' creada correctamente");

    // Insertar usuario admin
    await db.query("INSERT INTO usuarios (nombre, password) VALUES (?, ?)", [
      usuario,
      hash,
    ]);
    console.log("✅ Usuario admin creado correctamente");
    console.log("👤 Usuario:", usuario);
    console.log("🔑 Password:", password);

    await db.end();
    process.exit();
  } catch (error) {
    console.error("❌ Error creando admin:", error);
    process.exit(1);
  }
}

crearAdmin();