require('dotenv').config();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
      ssl: false // Railway geralmente não exige SSL
    },
    logging: console.log,     // imprime cada SQL gerado
    benchmark: true,          // mostra tempo de execução (opcional)
  }
);

module.exports = sequelize;
