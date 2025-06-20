const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    idUsuarios: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    senha_hash: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'usuarios',
    timestamps: false
  });

  return Usuario;
};
