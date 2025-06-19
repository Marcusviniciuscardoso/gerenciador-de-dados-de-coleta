module.exports = (sequelize, DataTypes) => {
  const Coleta = sequelize.define('Coleta', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    especie: { type: DataTypes.STRING, allowNull: false },
    local: { type: DataTypes.STRING, allowNull: false },
    data: { type: DataTypes.DATEONLY, allowNull: false },
    hora: { type: DataTypes.TIME, allowNull: false },
    notas: { type: DataTypes.TEXT },
  });

  Coleta.associate = (models) => {
    Coleta.belongsTo(models.Projeto, { foreignKey: 'projetoId' });
    Coleta.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
    Coleta.hasMany(models.Amostra, { foreignKey: 'coletaId' });
    Coleta.hasMany(models.Imagem, { foreignKey: 'coletaId' });
  };

  return Coleta;
};
