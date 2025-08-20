const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Imagem = sequelize.define('Imagem', {
    idImagens: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    amostraId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'amostras',
        key: 'idAmostras'
      }
    },
    coletaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'coletas',
        key: 'idColetas'
      }
    },
    /*arquivo_base64: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },*/
    descricao: {
      type: DataTypes.STRING(255)
    }
  }, {
    tableName: 'imagens',
    timestamps: false
  });

  return Imagem;
};
