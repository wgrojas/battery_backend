const mysql = require("mysql2/promise");
require("dotenv").config();

let db;

if (process.env.DATABASE_URL) {
  // Conexión PlanetScale usando DATABASE_URL
  const url = new URL(process.env.DATABASE_URL);

  db = mysql.createPool({
    host: url.hostname,
    user: url.username,
    password: url.password,
    database: url.pathname.replace("/", ""), // quitar la /
    port: url.port || 3306,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    ssl: { rejectUnauthorized: true }, // obligatorio PlanetScale
    connectTimeout: 20000,
  });

  // Verificar conexión PlanetScale
  (async () => {
    try {
      const connection = await db.getConnection();
      console.log("✅ Conectado a PlanetScale correctamente");
      connection.release();
    } catch (err) {
      console.error("❌ Error conectando a PlanetScale:", err);
    }
  })();
} else {
  // Conexión local
  db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  });

  // Verificar conexión local
  (async () => {
    try {
      const connection = await db.getConnection();
      console.log("✅ Conectado a la base de datos local correctamente");
      connection.release();
    } catch (err) {
      console.error("❌ Error conectando a la base de datos local:", err);
    }
  })();
}

module.exports = db;
