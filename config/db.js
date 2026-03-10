const mysql = require("mysql2");
const { URL } = require("url");

// Cargar dotenv solo en local
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ DATABASE_URL no definida");
  throw new Error("DATABASE_URL no definida");
}

const dbUrl = new URL(databaseUrl);

const pool = mysql.createPool({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace("/", ""),
  port: dbUrl.port || 3306,
  ssl: { rejectUnauthorized: true }, // obligatorio PlanetScale
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const db = pool.promise();

db.getConnection()
  .then(conn => {
    console.log("✅ MySQL conectado (Pool)");
    conn.release();
  })
  .catch(err => {
    console.error("❌ Error conectando a MySQL:", err);
  });

module.exports = db;