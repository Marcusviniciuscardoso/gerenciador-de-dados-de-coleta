const { Amostra } = require('../models');

module.exports = {
  async listar(req, res) {
    const amostras = await Amostra.findAll();
    res.json(amostras);
  },

  async criar(req, res) {
    const { coletaId, codigo, recipiente, estado, identificacao_final, observacoes } = req.body;

    const amostra = await Amostra.create({
      coletaId, codigo, recipiente, estado, identificacao_final, observacoes
    });

    res.status(201).json(amostra);
  },

  async atualizar(req, res) {
    const { id } = req.params;
    const dados = req.body;

    await Amostra.update(dados, { where: { idAmostras: id } });
    const amostraAtualizada = await Amostra.findByPk(id);
    res.json(amostraAtualizada);
  },

  async deletar(req, res) {
    const { id } = req.params;
    await Amostra.destroy({ where: { idAmostras: id } });
    res.status(204).send();
  }
};
