const { Imagem } = require('../models');

module.exports = {
  async listar(req, res) {
    const imagens = await Imagem.findAll();
    res.json(imagens);
  },

  async criar(req, res) {
    const { amostraId, coletaId, arquivo_base64, descricao } = req.body;

    const imagem = await Imagem.create({
      amostraId, coletaId, arquivo_base64, descricao
    });

    res.status(201).json(imagem);
  },

  async atualizar(req, res) {
    const { id } = req.params;
    const dados = req.body;

    await Imagem.update(dados, { where: { idImagens: id } });
    const imagemAtualizada = await Imagem.findByPk(id);
    res.json(imagemAtualizada);
  },

  async deletar(req, res) {
    const { id } = req.params;
    await Imagem.destroy({ where: { idImagens: id } });
    res.status(204).send();
  }
};
