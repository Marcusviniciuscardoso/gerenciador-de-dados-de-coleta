module.exports = (sequelize, DataTypes) => {
  const Imagem = sequelize.define('Imagem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    url: { type: DataTypes.STRING, allowNull: false }, // URL ou path da imagem
    descricao: { type: DataTypes.TEXT },
  });

  Imagem.associate = (models) => {
    Imagem.belongsTo(models.Coleta, { foreignKey: 'coletaId' });
  };

  return Imagem;
};
