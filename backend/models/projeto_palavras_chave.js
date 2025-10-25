module.exports = (sequelize, DataTypes) => {
  const ProjetoPalavrasChave = sequelize.define('ProjetoPalavrasChave', {
    projeto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'projetos',
        key: 'idProjetos'
      }
    },
    palavra_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'palavras_chave',
        key: 'id'
      }
    }
  }, {
    tableName: 'projeto_palavras_chave',
    timestamps: false
  });

  return ProjetoPalavrasChave;
};
