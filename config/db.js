// const mysql = require("mysql2")
// require("dotenv").config()

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//    ssl: {
//     rejectUnauthorized: true
//   }
// })

// db.connect((err) => {
//   if (err) {
//     console.log("❌ Error conectando a MySQL:", err)
//   } else {
//     console.log("✅ MySQL conectado")
//   }
// })

// module.exports = db

// bd.js
const mysql = require("mysql2");
require("dotenv").config();
const { URL } = require("url");

// Tomamos DATABASE_URL de Heroku
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ No se encontró la variable DATABASE_URL");
  process.exit(1);
}

// Parseamos la URL
const dbUrl = new URL(databaseUrl);

// Creamos un pool de conexiones
const pool = mysql.createPool({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace("/", ""),
  port: dbUrl.port || 3306,
  ssl: { rejectUnauthorized: true }, // obligatorio para PlanetScale
  waitForConnections: true,
  connectionLimit: 10, // máximo 10 conexiones simultáneas
  queueLimit: 0
});

// Exportamos la versión con promesas para async/await
const db = pool.promise();

// Test de conexión al iniciar
db.getConnection()
  .then(conn => {
    console.log("✅ MySQL conectado (Pool)");
    conn.release();
  })
  .catch(err => {
    console.error("❌ Error conectando a MySQL:", err);
  });

module.exports = db;