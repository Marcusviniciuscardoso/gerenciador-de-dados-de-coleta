const { Projeto } = require('../models');

module.exports = {
  async listar(req, res) {
    const projetos = await Projeto.findAll();
    res.json(projetos);
  },

  async criar(req, res) {
    const { nome, descricao, objetivo, data_inicio, data_fim, criado_por } = req.body;
    const projeto = await Projeto.create({ nome, descricao, objetivo, data_inicio, data_fim, criado_por });
    res.status(201).json(projeto);
  },

  async atualizar(req, res) {
    const { id } = req.params;
    const dados = req.body;

    await Projeto.update(dados, { where: { idProjetos: id } });
    const projetoAtualizado = await Projeto.findByPk(id);
    res.json(projetoAtualizado);
  },

  async deletar(req, res) {
    const { id } = req.params;
    await Projeto.destroy({ where: { idProjetos: id } });
    res.status(204).send();
  }
};
