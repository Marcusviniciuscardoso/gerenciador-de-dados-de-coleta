const { Coleta } = require('../models');

module.exports = {
  async listar(req, res) {
    const coletas = await Coleta.findAll();
    res.json(coletas);
  },

  async criar(req, res) {
    const {
      projetoId, local, latitude, longitude, data,
      hora_inicio, hora_fim, fase_lunar, tipo_armadilha,
      observacoes, coletado_por
    } = req.body;

    const coleta = await Coleta.create({
      projetoId, local, latitude, longitude, data,
      hora_inicio, hora_fim, fase_lunar, tipo_armadilha,
      observacoes, coletado_por
    });

    res.status(201).json(coleta);
  },

  async atualizar(req, res) {
    const { id } = req.params;
    const dados = req.body;

    await Coleta.update(dados, { where: { idColetas: id } });
    const coletaAtualizada = await Coleta.findByPk(id);
    res.json(coletaAtualizada);
  },

  async deletar(req, res) {
    const { id } = req.params;
    await Coleta.destroy({ where: { idColetas: id } });
    res.status(204).send();
  }
};
