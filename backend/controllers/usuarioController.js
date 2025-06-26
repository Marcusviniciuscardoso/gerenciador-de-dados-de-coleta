const { Usuario } = require('../models');

module.exports = {
  async listar(req, res) {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  },

  async obterPorId(req, res) {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(usuario);
  },

  async criar(req, res) {
    try {
      const { nome, telefone, instituicao, biografia, credencial_id } = req.body;
      const usuario = await Usuario.create({ nome, telefone, instituicao, biografia, credencial_id });
      res.status(201).json(usuario);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  },

  async atualizar(req, res) {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

    await usuario.update(req.body);
    res.json(usuario);
  },

  async deletar(req, res) {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

    await usuario.destroy();
    res.status(204).send();
  }
};
