const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Imagem = sequelize.define('Imagem', {
    idImagens: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    amostraId: {
      type: DataTypes.INTEGER
    },
    coletaId: {
      type: DataTypes.INTEGER
    },
    arquivo_base64: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    descricao: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'imagens',
    timestamps: false
  });

  return Imagem;
};
