const sequelize = require('../config/database'); // ajuste o caminho conforme sua estrutura
const Usuario = require('../models/usuario')(sequelize); // ou use { Usuario } se tiver um index.js

async function testarCriacaoUsuario() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão bem-sucedida.');

    await sequelize.sync(); // Garante que as tabelas existam

    const novoUsuario = await Usuario.create({
      nome: 'João Teste',
      telefone: '99999-0000',
      instituicao: 'UFOPA',
      biografia: 'Pesquisador de insetos',
      credencial_id: 1 // Certifique-se que essa credencial existe
    });

    console.log('✅ Usuário criado com sucesso:', novoUsuario.toJSON());
  } catch (error) {
    console.error('❌ Erro ao testar criação de usuário:', error);
  } finally {
    await sequelize.close();
  }
}

testarCriacaoUsuario();
