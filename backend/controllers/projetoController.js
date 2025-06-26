const { Projeto } = require('../models');

module.exports = {
  async listar(req, res) {
    try {
      const projetos = await Projeto.findAll();
      res.json(projetos);
    } catch (error) {
      console.error('Erro ao listar projetos:', error);
      res.status(500).json({ error: 'Erro ao listar projetos', detalhes: error.message });
    }
  },

  async criar(req, res) {
    try {
      const {
        nome,
        descricao,
        objetivos,
        metodologia,
        resultadosEsperados,
        palavrasChave,
        colaboradores,
        financiamento,
        orcamento,
        data_inicio,
        data_fim,
        criado_por,
        imageLink
      } = req.body;

      const projeto = await Projeto.create({
        nome,
        descricao,
        objetivos,
        metodologia,
        resultadosEsperados,
        palavrasChave,
        colaboradores,
        financiamento,
        orcamento,
        data_inicio,
        data_fim,
        criado_por,
        imageLink
      });

      res.status(201).json(projeto);
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      res.status(500).json({ error: 'Erro ao criar projeto', detalhes: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const dados = req.body;

      await Projeto.update(dados, { where: { idProjetos: id } });
      const projetoAtualizado = await Projeto.findByPk(id);
      res.json(projetoAtualizado);
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      res.status(500).json({ error: 'Erro ao atualizar projeto', detalhes: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      await Projeto.destroy({ where: { idProjetos: id } });
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar projeto:', error);
      res.status(500).json({ error: 'Erro ao deletar projeto', detalhes: error.message });
    }
  }
};
