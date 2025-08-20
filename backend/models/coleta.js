const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Coleta = sequelize.define('Coleta', {
    idColetas: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    projetoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'projetos',
        key: 'idProjetos'
      }
    },
    local: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false
    },
    dataColeta: {
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
    /*fase_lunar: {
      type: DataTypes.STRING
    },
    tipo_armadilha: {
      type: DataTypes.STRING
    },*/
    observacoes: {
      type: DataTypes.TEXT
    },
    coletado_por: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'idUsuarios'
      }
    }
  }, {
    tableName: 'coletas',
    timestamps: false
  });

  return Coleta;
};
