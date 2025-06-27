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
      allowNull: false,
      references: {
        model: 'coletas',
        key: 'idColetas'
      }
    },
    codigo: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT
    },
    tipoAmostra: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    quantidade: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    recipiente: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    metodoPreservacao: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    validade: {
      type: DataTypes.DATE,
      allowNull: false
    },
    identificacao_final: {
      type: DataTypes.STRING(255)
    },
    observacoes: {
      type: DataTypes.TEXT
    },
    imageLink: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'amostras',
    timestamps: false
  });

  return Amostra;
};

