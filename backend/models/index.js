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

// Usuário ↔ Credencial (1:1)
Credencial.hasOne(Usuario, { foreignKey: 'credencial_id', as: 'usuario' });
Usuario.belongsTo(Credencial, { foreignKey: 'credencial_id', as: 'credencial' });

// Usuário (criador) ↔ Projeto (1:N)
Usuario.hasMany(Projeto, { foreignKey: 'criado_por', as: 'projetosCriados' });
Projeto.belongsTo(Usuario, { foreignKey: 'criado_por', as: 'criador' });

// Projeto ↔ Coleta (1:N)
Projeto.hasMany(Coleta, { foreignKey: 'projetoId', as: 'coletas' });
Coleta.belongsTo(Projeto, { foreignKey: 'projetoId', as: 'projeto' });

// Usuário (coletor) ↔ Coleta (1:N)
Usuario.hasMany(Coleta, { foreignKey: 'coletado_por', as: 'coletas' });
Coleta.belongsTo(Usuario, { foreignKey: 'coletado_por', as: 'coletor' });

// Coleta ↔ Amostra (1:N)
Coleta.hasMany(Amostra, { foreignKey: 'coletaId', as: 'amostras' });
Amostra.belongsTo(Coleta, { foreignKey: 'coletaId', as: 'coleta' });

// Imagens: podem referenciar Amostra e/ou Coleta
Imagem.belongsTo(Amostra, { foreignKey: 'amostraId', as: 'amostra' });
Amostra.hasMany(Imagem,   { foreignKey: 'amostraId', as: 'imagens' });

Imagem.belongsTo(Coleta,  { foreignKey: 'coletaId',  as: 'coleta' });
Coleta.hasMany(Imagem,    { foreignKey: 'coletaId',  as: 'imagens' });

// Auditoria ↔ Usuário (N:1)
Auditoria.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Usuario.hasMany(Auditoria,   { foreignKey: 'usuario_id', as: 'auditorias' });

// Projeto ↔ Usuário (colaboradores) (N:N) via projeto_usuarios
const throughProjUsers = { through: 'projeto_usuarios', foreignKey: 'projeto_id', otherKey: 'usuario_id' };
Projeto.belongsToMany(Usuario, { ...throughProjUsers, as: 'colaboradores' });
Usuario.belongsToMany(Projeto, { ...throughProjUsers, as: 'projetosColaborador' });

// Projeto ↔ PalavraChave (N:N) via projeto_palavras_chave
const throughProjTags = { through: 'projeto_palavras_chave', foreignKey: 'projeto_id', otherKey: 'palavra_id' };
Projeto.belongsToMany(PalavraChave, { ...throughProjTags, as: 'palavras' });
PalavraChave.belongsToMany(Projeto, { ...throughProjTags, as: 'projetos' });

// Projeto ↔ Financiador (N:N) via projeto_financeiros
// (se você renomear a tabela para projeto_financiadores, ajuste o 'through')
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
