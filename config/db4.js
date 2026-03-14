const mysql = require("mysql2/promise");
require("dotenv").config();

let db;

// ==============================
// FUNCIÓN PARA CONECTAR LOCAL
// ==============================
async function conectarLocal() {
  try {

    const pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "solar_monitor",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    const connection = await pool.getConnection();

    console.log("💻 MySQL local conectado correctamente");

    connection.release();

    return pool;

  } catch (err) {

    console.warn("⚠️ MySQL local no disponible");

    return null;

  }
}


// ==============================
// FUNCIÓN PLANETSCALE
// ==============================
async function conectarPlanetScale() {

  try {

    const url = new URL(process.env.DATABASE_URL);

    const pool = mysql.createPool({
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.replace("/", ""),
      port: url.port || 3306,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      ssl: { rejectUnauthorized: true },
      connectTimeout: 20000,
    });

    const connection = await pool.getConnection();

    console.log("🌎 Conectado a PlanetScale correctamente");

    connection.release();

    return pool;

  } catch (err) {

    console.error("❌ Error conectando a PlanetScale:", err.message);

    return null;

  }

}


// ==============================
// INICIALIZAR CONEXIÓN
// ==============================
(async () => {

  db = await conectarLocal();

  if (!db) {
    db = await conectarPlanetScale();
  }

  if (!db) {
    console.error("❌ No se pudo conectar a ninguna base de datos");
    process.exit(1);
  }

})();

module.exports = {
  query: (...args) => db.query(...args),
  execute: (...args) => db.execute(...args),
};