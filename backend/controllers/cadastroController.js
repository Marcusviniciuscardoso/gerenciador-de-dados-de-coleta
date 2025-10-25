const { Credencial, Usuario, sequelize } = require('../models');
const bcrypt = require('bcrypt');

module.exports = {
  async cadastrarUsuarioComCredencial(req, res) {
    const t = await sequelize.transaction();

    try {
      const { nome, telefone, instituicao, biografia, email, senha } = req.body;

      // 🔐 Gera hash da senha
      const senhaHash = await bcrypt.hash(senha, 10);

      // =============================
      // GERAÇÃO MANUAL DE IDs
      // =============================
      const ultimoIdCredencial = (await Credencial.max('idCredenciais')) || 0;
      const ultimoIdUsuario = (await Usuario.max('idUsuarios')) || 0;

      const novoIdCredencial = ultimoIdCredencial + 1;
      const novoIdUsuario = ultimoIdUsuario + 1;

      // =============================
      // CRIA CREDENCIAL
      // =============================
      const credencial = await Credencial.create({
        idCredenciais: novoIdCredencial,
        email,
        senha_hash: senhaHash
      }, { transaction: t });

      // =============================
      // CRIA USUÁRIO VINCULADO
      // =============================
      const usuario = await Usuario.create({
        idUsuarios: novoIdUsuario,
        nome,
        telefone,
        instituicao,
        biografia,
        credencial_id: credencial.idCredenciais
      }, { transaction: t });

      await t.commit();

      console.log('✅ Usuário e credencial criados com sucesso:', usuario.nome);

      return res.status(201).json({
        mensagem: 'Usuário cadastrado com sucesso!',
        usuario,
        credencial
      });

    } catch (error) {
      await t.rollback();
      console.error('❌ Erro ao cadastrar usuário com credencial:', error);
      return res.status(500).json({
        error: 'Erro ao cadastrar usuário',
        detalhes: error.message
      });
    }
  }
};
