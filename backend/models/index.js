const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Credencial    = require('./credencial')(sequelize, DataTypes);
const Usuario       = require('./usuario')(sequelize, DataTypes);
const Projeto       = require('./projeto')(sequelize, DataTypes);
const Coleta        = require('./coleta')(sequelize, DataTypes);
const Amostra       = require('./amostra')(sequelize, DataTypes);
const Imagem        = require('./imagem')(sequelize, DataTypes);
const Auditoria     = require('./auditoria')(sequelize, DataTypes);

// novos models
const Financiador   = require('./financiador')(sequelize, DataTypes);
const PalavraChave  = require('./palavraChave')(sequelize, DataTypes);

/* =======================
   Relacionamentos
   ======================= */

Credencial.hasOne(Usuario, { foreignKey: 'credencial_id', as: 'usuario' });
Usuario.belongsTo(Credencial, { foreignKey: 'credencial_id', as: 'credencial' });

Usuario.hasMany(Projeto, { foreignKey: 'criado_por', as: 'projetosCriados' });
Projeto.belongsTo(Usuario, { foreignKey: 'criado_por', as: 'criador' });

Projeto.hasMany(Coleta, { foreignKey: 'projetoId', as: 'coletas' });
Coleta.belongsTo(Projeto, { foreignKey: 'projetoId', as: 'projeto' });

Usuario.hasMany(Coleta, { foreignKey: 'coletado_por', as: 'coletas' });
Coleta.belongsTo(Usuario, { foreignKey: 'coletado_por', as: 'coletor' });

Coleta.hasMany(Amostra, { foreignKey: 'coletaId', as: 'amostras' });
Amostra.belongsTo(Coleta, { foreignKey: 'coletaId', as: 'coleta' });

Imagem.belongsTo(Amostra, { foreignKey: 'amostraId', as: 'amostra' });
Amostra.hasMany(Imagem,   { foreignKey: 'amostraId', as: 'imagens' });

Imagem.belongsTo(Coleta,  { foreignKey: 'coletaId',  as: 'coleta' });
Coleta.hasMany(Imagem,    { foreignKey: 'coletaId',  as: 'imagens' });

Auditoria.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

const throughProjUsers = { through: 'projeto_usuarios', foreignKey: 'projeto_id', otherKey: 'usuario_id' };
//Projeto.belongsToMany(Usuario, { ...throughProjUsers, as: 'colaboradores' });
Usuario.belongsToMany(Projeto, { ...throughProjUsers, as: 'projetosColaborador' });

const throughProjTags = { through: 'projeto_palavras_chave', foreignKey: 'projeto_id', otherKey: 'palavra_id' };
Projeto.belongsToMany(PalavraChave, { ...throughProjTags, as: 'palavras' });
PalavraChave.belongsToMany(Projeto, { ...throughProjTags, as: 'projetos' });

const throughProjFin = { through: 'projeto_financeiros', foreignKey: 'projeto_id', otherKey: 'financiadores_id' };
Projeto.belongsToMany(Financiador, { ...throughProjFin, as: 'financiadores' });
Financiador.belongsToMany(Projeto, { ...throughProjFin, as: 'projetos' });

module.exports = {
  sequelize,
  Credencial,
  Usuario,
  Projeto,
  Coleta,
  Amostra,
  Imagem,
  Auditoria,
  Financiador,
  PalavraChave,
};
