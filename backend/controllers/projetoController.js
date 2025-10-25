const { Projeto } = require('../models');
// const { Auditoria } = require('../models'); // Comentado caso deseje desativar todas as auditorias

module.exports = {
  async listar(req, res) {
    try {
      const projetos = await Projeto.findAll();

      // AUDITORIA
      /*
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: 'Listou todos os projetos'
      });
      */

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

      // AUDITORIA
      /*
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: `Criou o projeto ${nome}`
      });
      */

      res.status(201).json(projeto);
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      res.status(500).json({ error: 'Erro ao criar projeto teste', detalhes: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const dados = req.body;

      await Projeto.update(dados, { where: { idProjetos: id } });
      const projetoAtualizado = await Projeto.findByPk(id);

      // AUDITORIA
      /*
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: `Atualizou o projeto ID ${id}`
      });
      */

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

      // AUDITORIA
      /*
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: `Deletou o projeto ID ${id}`
      });
      */

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar projeto:', error);
      res.status(500).json({ error: 'Erro ao deletar projeto', detalhes: error.message });
    }
  },

  async listarPorUsuario(req, res) {
    try {
      const { usuarioId } = req.params;

      const projetos = await Projeto.findAll({
        where: { criado_por: usuarioId }
      });

      // AUDITORIA
      /*
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: `Listou projetos do usuário ID ${usuarioId}`
      });
      */

      res.json(projetos);
    } catch (error) {
      console.error('Erro ao listar projetos do usuário:', error);
      res.status(500).json({ error: 'Erro ao listar projetos do usuário', detalhes: error.message });
    }
  },

  async obterPorId(req, res) {
    try {
      const { id } = req.params;

      const projeto = await Projeto.findByPk(id);

      if (!projeto) {
        return res.status(404).json({ error: 'Projeto não encontrado' });
      }

      // AUDITORIA
      /*
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: `Consultou o projeto ID ${id}`
      });
      */

      res.json(projeto);
    } catch (error) {
      console.error('Erro ao obter projeto por ID:', error);
      res.status(500).json({ error: 'Erro ao obter projeto', detalhes: error.message });
    }
  }
};
