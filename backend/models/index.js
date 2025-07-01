const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Credencial = require('./credencial')(sequelize, DataTypes);
const Usuario = require('./usuario')(sequelize, DataTypes);
const Projeto = require('./projeto')(sequelize, DataTypes);
const Coleta = require('./coleta')(sequelize, DataTypes);
const Amostra = require('./amostra')(sequelize, DataTypes);
const Imagem = require('./imagem')(sequelize, DataTypes);
const Auditoria = require('./auditoria')(sequelize, DataTypes);

// Relacionamentos

// Usuario → Credencial
Credencial.hasOne(Usuario, { foreignKey: 'credencial_id' });
Usuario.belongsTo(Credencial, { foreignKey: 'credencial_id' });

// Usuario → Projeto
Usuario.hasMany(Projeto, { foreignKey: 'criado_por' });
Projeto.belongsTo(Usuario, { foreignKey: 'criado_por' });

// Projeto → Coleta
Projeto.hasMany(Coleta, { foreignKey: 'projetoId' });
Coleta.belongsTo(Projeto, { foreignKey: 'projetoId' });

// Usuario → Coleta
Usuario.hasMany(Coleta, { foreignKey: 'coletado_por' });
Coleta.belongsTo(Usuario, { foreignKey: 'coletado_por' });

// Coleta → Amostra
Coleta.hasMany(Amostra, { foreignKey: 'coletaId' });
Amostra.belongsTo(Coleta, { foreignKey: 'coletaId' });

// Coleta → Imagem
Coleta.hasMany(Imagem, { foreignKey: 'coletaId' });
Imagem.belongsTo(Coleta, { foreignKey: 'coletaId' });

// Amostra → Imagem
Amostra.hasMany(Imagem, { foreignKey: 'amostraId' });
Imagem.belongsTo(Amostra, { foreignKey: 'amostraId' });

module.exports = {
  sequelize,
  Credencial,
  Usuario,
  Projeto,
  Coleta,
  Amostra,
  Imagem,
  Auditoria,
};
