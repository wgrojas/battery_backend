const mysql = require("mysql2/promise");
require("dotenv").config();

let db;

try {
  db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "solar_monitor",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // Verificar la conexión
  (async () => {
    try {
      const connection = await db.getConnection();
      console.log("✅ MySQL local conectado correctamente");
      connection.release();
    } catch (err) {
      console.error("❌ Error conectando a MySQL local:", err.message);
    }
  })();

} catch (err) {
  console.error("❌ Error creando el pool de MySQL:", err.message);
}

module.exports = db;