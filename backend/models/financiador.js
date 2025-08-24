const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Financiador = sequelize.define('Financiador', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    financiadorNome: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
  });

  return Financiador;
};
