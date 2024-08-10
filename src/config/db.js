require('dotenv').config()
const knex = require('knex')
const dbConfig = {
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
}
const db = knex(dbConfig)
module.exports = { 
  db,
  dbConfig
}