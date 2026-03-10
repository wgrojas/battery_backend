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

const mysql = require("mysql2")
require("dotenv").config()
const { URL } = require("url")

// Tomamos DATABASE_URL de Heroku
const databaseUrl = process.env.DATABASE_URL
const dbUrl = new URL(databaseUrl)

const db = mysql.createConnection({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace("/", ""),
  port: dbUrl.port || 3306,
  ssl: { rejectUnauthorized: true }
})

db.connect((err) => {
  if (err) {
    console.log("❌ Error conectando a MySQL:", err)
  } else {
    console.log("✅ MySQL conectado")
  }
})

module.exports = db