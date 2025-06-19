const sequelize = require('../config/database');

const Usuario = require('./usuario');
const Projeto = require('./projeto');
const Coleta = require('./coleta');
const Amostra = require('./amostra');
const Imagem = require('./imagem');

// Relacionamentos
Usuario.hasMany(Projeto, { foreignKey: 'criado_por' });
Projeto.belongsTo(Usuario, { foreignKey: 'criado_por' });

Projeto.hasMany(Coleta, { foreignKey: 'projetoId' });
Coleta.belongsTo(Projeto, { foreignKey: 'projetoId' });

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