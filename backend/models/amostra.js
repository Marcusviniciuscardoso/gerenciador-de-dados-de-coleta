module.exports = (sequelize, DataTypes) => {
  const Amostra = sequelize.define('Amostra', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    descricao: { type: DataTypes.TEXT, allowNull: false },
  });

  Amostra.associate = (models) => {
    Amostra.belongsTo(models.Coleta, { foreignKey: 'coletaId' });
  };

  return Amostra;
};
