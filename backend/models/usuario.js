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
    telefone: {
      type: DataTypes.STRING
    },
    instituicao: {
      type: DataTypes.STRING
    },
    biografia: {
      type: DataTypes.TEXT
    },
    data_cadastro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    credencial_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'credenciais',
        key: 'idCredenciais'
      }
    }
  }, {
    tableName: 'usuarios',
    timestamps: false
  });

  return Usuario;
};
