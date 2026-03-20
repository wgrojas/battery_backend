const mysql = require("mysql2/promise");
require("dotenv").config();

// Parsear DATABASE_URL de PlanetScale
const url = new URL(process.env.DATABASE_URL);

const db = mysql.createPool({
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

// Verificar conexión
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ Conectado a PlanetScale correctamente");
    connection.release();
  } catch (err) {
    console.error("❌ Error conectando a PlanetScale:", err);
  }
})();

module.exports = db;

// const mysql = require("mysql2/promise");
// require("dotenv").config();

// let db;

// try {
//   db = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER, 
//     password: process.env.DB_PASSWORD, 
//     database: process.env.DB_NAME, 
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
//   });

//   // Verificar la conexión
//   (async () => {
//     try {
//       const connection = await db.getConnection();
//       console.log("✅ MySQL local conectado correctamente");
//       connection.release();
//     } catch (err) {
//       console.error("❌ Error conectando a MySQL local:", err.message);
//     }
//   })();

// } catch (err) {
//   console.error("❌ Error creando el pool de MySQL:", err.message);
// }

// module.exports = db;