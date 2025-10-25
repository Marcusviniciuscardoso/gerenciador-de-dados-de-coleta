module.exports = (sequelize, DataTypes) => {
  const ProjetoUsuarios = sequelize.define('ProjetoUsuarios', {
    projeto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'projetos',
        key: 'idProjetos'
      }
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'idUsuarios'
      }
    }
  }, {
    tableName: 'projeto_usuarios',
    timestamps: false
  });

  return ProjetoUsuarios;
};
