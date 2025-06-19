const { Amostra } = require('../models');

module.exports = {
  async listar(req, res) {
    const amostras = await Amostra.findAll();
    res.json(amostras);
  },

  async obterPorId(req, res) {
    const amostra = await Amostra.findByPk(req.params.id);
    if (!amostra) return res.status(404).json({ error: 'Amostra não encontrada' });
    res.json(amostra);
  },

  async criar(req, res) {
    const amostra = await Amostra.create(req.body);
    res.status(201).json(amostra);
  },

  async atualizar(req, res) {
    const amostra = await Amostra.findByPk(req.params.id);
    if (!amostra) return res.status(404).json({ error: 'Amostra não encontrada' });

    await amostra.update(req.body);
    res.json(amostra);
  },

  async deletar(req, res) {
    const amostra = await Amostra.findByPk(req.params.id);
    if (!amostra) return res.status(404).json({ error: 'Amostra não encontrada' });

    await amostra.destroy();
    res.status(204).send();
  }
};
