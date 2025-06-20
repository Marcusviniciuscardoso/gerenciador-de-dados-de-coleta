const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Coleta = sequelize.define('Coleta', {
    idColetas: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    projetoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    local: {
      type: DataTypes.STRING,
      allowNull: false
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: false
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: false
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false
    },
    hora_fim: {
      type: DataTypes.TIME,
      allowNull: false
    },
    fase_lunar: {
      type: DataTypes.STRING
    },
    tipo_armadilha: {
      type: DataTypes.STRING
    },
    observacoes: {
      type: DataTypes.TEXT
    },
    coletado_por: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'coletas',
    timestamps: false
  });

  return Coleta;
};
