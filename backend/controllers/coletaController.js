const { Coleta } = require('../models');

module.exports = {
  async listar(req, res) {
    const coletas = await Coleta.findAll();
    res.json(coletas);
  },

  async obterPorId(req, res) {
    const coleta = await Coleta.findByPk(req.params.id);
    if (!coleta) return res.status(404).json({ error: 'Coleta não encontrada' });
    res.json(coleta);
  },

  async criar(req, res) {
    const coleta = await Coleta.create(req.body);
    res.status(201).json(coleta);
  },

  async atualizar(req, res) {
    const coleta = await Coleta.findByPk(req.params.id);
    if (!coleta) return res.status(404).json({ error: 'Coleta não encontrada' });

    await coleta.update(req.body);
    res.json(coleta);
  },

  async deletar(req, res) {
    const coleta = await Coleta.findByPk(req.params.id);
    if (!coleta) return res.status(404).json({ error: 'Coleta não encontrada' });

    await coleta.destroy();
    res.status(204).send();
  }
};
