const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Projeto = sequelize.define('Projeto', {
    idProjetos: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT
    },
    objetivo: {
      type: DataTypes.TEXT
    },
    data_inicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    data_fim: {
      type: DataTypes.DATE
    },
    criado_por: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'projetos',
    timestamps: false
  });

  return Projeto;
};
