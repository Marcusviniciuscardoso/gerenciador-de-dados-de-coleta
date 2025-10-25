const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    idUsuarios: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    telefone: DataTypes.STRING(50),
    instituicao: DataTypes.STRING(255),
    biografia: DataTypes.TEXT,
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
