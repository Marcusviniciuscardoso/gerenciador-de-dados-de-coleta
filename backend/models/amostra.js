const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Amostra = sequelize.define('Amostra', {
    idAmostras: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    coletaId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    recipiente: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING
    },
    identificacao_final: {
      type: DataTypes.STRING
    },
    observacoes: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'amostras',
    timestamps: false
  });

  return Amostra;
};
