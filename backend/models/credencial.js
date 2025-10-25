const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Credencial = sequelize.define('Credencial', {
    idCredenciais: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    senha_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'credenciais',
    timestamps: false
  });

  return Credencial;
};
