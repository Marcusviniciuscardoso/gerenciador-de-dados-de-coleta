const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

/* ========= Models principais (ativos) ========= */
const Credencial = require('./credencial')(sequelize, DataTypes);
const Usuario    = require('./usuario')(sequelize, DataTypes);
const Projeto    = require('./projeto')(sequelize, DataTypes);
const Coleta     = require('./coleta')(sequelize, DataTypes);
const Amostra    = require('./amostra')(sequelize, DataTypes);
const Imagem     = require('./imagem')(sequelize, DataTypes);
const Auditoria  = require('./auditoria')(sequelize, DataTypes);

/* ========= Models auxiliares (desativados por enquanto) ========= */
// const Financiador          = require('./financiador')(sequelize, DataTypes);
// const PalavraChave         = require('./palavraChave')(sequelize, DataTypes);

/* ========= Tabelas de ligação (desativadas por enquanto) ========= */
// const ProjetoFinanceiros   = require('./projeto_financeiros')(sequelize, DataTypes);
// const ProjetoUsuarios      = require('./projeto_usuarios')(sequelize, DataTypes);
// const ProjetoPalavrasChave = require('./projeto_palavras_chave')(sequelize, DataTypes);

/* =======================
   RELACIONAMENTOS ATIVOS
   ======================= */

/* sem N-N */

/* Usuário <-> Credencial */
Credencial.hasOne(Usuario, { foreignKey: 'credencial_id', as: 'usuario' });
Usuario.belongsTo(Credencial, { foreignKey: 'credencial_id', as: 'credencial' });

/* Usuário <-> Projeto (criador) */
Usuario.hasMany(Projeto, { foreignKey: 'criado_por', as: 'projetosCriados' });
Projeto.belongsTo(Usuario, { foreignKey: 'criado_por', as: 'criador' });

/* Projeto <-> Coleta */
Projeto.hasMany(Coleta, { foreignKey: 'projetoId', as: 'coletas' });
Coleta.belongsTo(Projeto, { foreignKey: 'projetoId', as: 'projeto' });

/* Usuário <-> Coleta (coletor) */
Usuario.hasMany(Coleta, { foreignKey: 'coletado_por', as: 'coletas' });
Coleta.belongsTo(Usuario, { foreignKey: 'coletado_por', as: 'coletor' });

/* Coleta <-> Amostra */
Coleta.hasMany(Amostra, { foreignKey: 'coletaId', as: 'amostras' });
Amostra.belongsTo(Coleta, { foreignKey: 'coletaId', as: 'coleta' });

/* Amostra <-> Imagem */
Amostra.hasMany(Imagem, { foreignKey: 'amostraId', as: 'imagens' });
Imagem.belongsTo(Amostra, { foreignKey: 'amostraId', as: 'amostra' });

/* Coleta <-> Imagem (se você usa imagens de coleta também) */
Coleta.hasMany(Imagem, { foreignKey: 'coletaId', as: 'imagens' });
Imagem.belongsTo(Coleta, { foreignKey: 'coletaId', as: 'coleta' });

/* Auditoria <-> Usuário */
Auditoria.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuarioRef' });

/* =======================
   RELACIONAMENTOS N-N (comentados)
   ======================= */

/* Projeto <-> Financiador */
// Projeto.belongsToMany(Financiador, {
//   through: ProjetoFinanceiros,
//   foreignKey: 'projeto_id',
//   otherKey: 'financiadores_id',
//   as: 'financiadores'
// });
// Financiador.belongsToMany(Projeto, {
//   through: ProjetoFinanceiros,
//   foreignKey: 'financiadores_id',
//   otherKey: 'projeto_id',
//   as: 'projetos'
// });

/* Projeto <-> Usuário (colaboradores) */
// Projeto.belongsToMany(Usuario, {
//   through: ProjetoUsuarios,
//   foreignKey: 'projeto_id',
//   otherKey: 'usuario_id',
//   as: 'usuariosColaboradores'
// });
// Usuario.belongsToMany(Projeto, {
//   through: ProjetoUsuarios,
//   foreignKey: 'usuario_id',
//   otherKey: 'projeto_id',
//   as: 'projetosColaborador'
// });

/* Projeto <-> PalavraChave */
// Projeto.belongsToMany(PalavraChave, {
//   through: ProjetoPalavrasChave,
//   foreignKey: 'projeto_id',
//   otherKey: 'palavra_id',
//   as: 'palavras'
// });
// PalavraChave.belongsToMany(Projeto, {
//   through: ProjetoPalavrasChave,
//   foreignKey: 'palavra_id',
//   otherKey: 'projeto_id',
//   as: 'projetos'
// });

/* =======================
   EXPORTAÇÃO
   ======================= */
module.exports = {
  sequelize,

  /* principais (ativos) */
  Credencial,
  Usuario,
  Projeto,
  Coleta,
  Amostra,
  Imagem,
  Auditoria,

  /* auxiliares / junções (desativados) */
  // Financiador,
  // PalavraChave,
  // ProjetoFinanceiros,
  // ProjetoUsuarios,
  // ProjetoPalavrasChave
};
