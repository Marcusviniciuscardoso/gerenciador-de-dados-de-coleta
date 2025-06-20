const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'coleta_dados',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '1234',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false, // opcional: remove logs SQL do terminal
  }
);

module.exports = sequelize;
