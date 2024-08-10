require('dotenv/config')
const { dbConfig } = require('./src/config/db')
module.exports = {
  development: dbConfig,
  //production: dbConfig
};
