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
    descricao: DataTypes.TEXT,
    objetivos: DataTypes.TEXT,
    metodologia: DataTypes.TEXT,
    resultadosEsperados: DataTypes.TEXT,
    palavrasChave: DataTypes.TEXT,
    colaboradores: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    financiamento: DataTypes.TEXT,
    orcamento: DataTypes.TEXT,
    data_inicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    data_fim: DataTypes.DATE,
    criado_por: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'idUsuarios'
      }
    },
    imageLink: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'projetos',
    timestamps: false
  });

  return Projeto;
};
