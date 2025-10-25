module.exports = (sequelize, DataTypes) => {
  const ProjetoFinanceiros = sequelize.define('ProjetoFinanceiros', {
    projeto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'projetos',
        key: 'idProjetos'
      }
    },
    financiadores_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'financiadores',
        key: 'idFinanciadores'
      }
    }
  }, {
    tableName: 'projeto_financeiros',
    timestamps: false
  });

  return ProjetoFinanceiros;
};
