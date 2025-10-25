const { Credencial, Usuario, sequelize } = require('../models');
const bcrypt = require('bcrypt');

module.exports = {
  async cadastrarUsuarioComCredencial(req, res) {
    const t = await sequelize.transaction();
    try {
      const { nome, telefone, instituicao, biografia, email, senha } = req.body;

      // Cria a credencial
      const hash = await bcrypt.hash(senha, 10);
      const credencial = await Credencial.create({
        email,
        senha_hash: hash
      }, { transaction: t });

      // Cria o usuário vinculado à credencial
      const usuario = await Usuario.create({
        nome,
        telefone,
        instituicao,
        biografia,
        credencial_id: credencial.idCredenciais
      }, { transaction: t });

      await t.commit();
      return res.status(201).json({ usuario, credencial });

    } catch (error) {
      await t.rollback();
      console.error('Erro ao cadastrar usuário com credencial:', error);
      return res.status(500).json({ error: 'Erro ao cadastrar usuário', detalhes: error.message });
    }
  }
};
