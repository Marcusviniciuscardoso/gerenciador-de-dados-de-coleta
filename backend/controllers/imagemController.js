const { Imagem } = require('../models');

module.exports = {
  async listar(req, res) {
    const imagens = await Imagem.findAll();
    res.json(imagens);
  },

  async obterPorId(req, res) {
    const imagem = await Imagem.findByPk(req.params.id);
    if (!imagem) return res.status(404).json({ error: 'Imagem não encontrada' });
    res.json(imagem);
  },

  async criar(req, res) {
    const imagem = await Imagem.create(req.body);
    res.status(201).json(imagem);
  },

  async atualizar(req, res) {
    const imagem = await Imagem.findByPk(req.params.id);
    if (!imagem) return res.status(404).json({ error: 'Imagem não encontrada' });

    await imagem.update(req.body);
    res.json(imagem);
  },

  async deletar(req, res) {
    const imagem = await Imagem.findByPk(req.params.id);
    if (!imagem) return res.status(404).json({ error: 'Imagem não encontrada' });

    await imagem.destroy();
    res.status(204).send();
  }
};
