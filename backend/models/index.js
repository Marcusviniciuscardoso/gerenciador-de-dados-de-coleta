const sequelize = require('../config/database');

const Usuario = require('./usuario')(sequelize);
const Projeto = require('./projeto')(sequelize);
const Coleta = require('./coleta')(sequelize);
const Amostra = require('./amostra')(sequelize);
const Imagem = require('./imagem')(sequelize);

// Relacionamentos
Usuario.hasMany(Projeto, { foreignKey: 'criado_por' });
Projeto.belongsTo(Usuario, { foreignKey: 'criado_por' });

Projeto.hasMany(Coleta, { foreignKey: 'projetoId' });
Coleta.belongsTo(Projeto, { foreignKey: 'projetoId' });

Usuario.hasMany(Coleta, { foreignKey: 'coletado_por' });
Coleta.belongsTo(Usuario, { foreignKey: 'coletado_por' });

Coleta.hasMany(Amostra, { foreignKey: 'coletaId' });
Amostra.belongsTo(Coleta, { foreignKey: 'coletaId' });

Coleta.hasMany(Imagem, { foreignKey: 'coletaId' });
Imagem.belongsTo(Coleta, { foreignKey: 'coletaId' });

Amostra.hasMany(Imagem, { foreignKey: 'amostraId' });
Imagem.belongsTo(Amostra, { foreignKey: 'amostraId' });

module.exports = {
  sequelize,
  Usuario,
  Projeto,
  Coleta,
  Amostra,
  Imagem
};
