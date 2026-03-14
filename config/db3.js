const mysql = require("mysql2/promise");
require("dotenv").config();

let db;

// ==============================
// PLANETSCALE SI EXISTE URL
// ==============================
if (process.env.DATABASE_URL) {

  const url = new URL(process.env.DATABASE_URL);

  db = mysql.createPool({
    host: url.hostname,
    user: url.username,
    password: url.password,
    database: url.pathname.replace("/", ""),
    port: url.port || 3306,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    ssl: { rejectUnauthorized: true }
  });

  console.log("🌎 Usando PlanetScale");

} else {

  // ==============================
  // MYSQL LOCAL
  // ==============================
  db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "solar_monitor",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  console.log("💻 Usando MySQL local");
}


// ==============================
// PROBAR CONEXIÓN
// ==============================
(async () => {

  try {

    const connection = await db.getConnection();

    console.log("✅ Base de datos conectada");

    connection.release();

  } catch (err) {

    console.error("❌ Error conectando a la base de datos:", err.message);

  }

})();

module.exports = db;