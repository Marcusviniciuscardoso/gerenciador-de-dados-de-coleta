const { Projeto, Financiador, PalavraChave, Usuario } = require('../models');
// const { Auditoria } = require('../models'); // desativado por enquanto

module.exports = {
  async listar(req, res) {
    try {
      const projetos = await Projeto.findAll({
        include: [
          { model: Usuario, as: 'usuariosColaboradores', attributes: ['idUsuarios', 'nome'] },
          { model: Financiador, as: 'financiadores', attributes: ['idFinanciadores', 'financiadorNome'] },
          { model: PalavraChave, as: 'palavras', attributes: ['id', 'palavra'] }
        ]
      });

      res.json(projetos);
    } catch (error) {
      console.error('Erro ao listar projetos:', error);
      res.status(500).json({ error: 'Erro ao listar projetos', detalhes: error.message });
    }
  },

  async criar(req, res) {
    try {
      // id do token = id da CREDENCIAL
      const credencialId = req.user?.id;
      const usuario = await Usuario.findOne({ where: { credencial_id: credencialId } });
      if (!usuario) {
        return res.status(400).json({ error: 'Usuário não encontrado para a credencial do token' });
      }

      const {
        nome, descricao, objetivos, metodologia,
        resultadosEsperados, palavrasChave,
        colaboradores, financiamento, orcamento,
        data_inicio, data_fim, imageLink
      } = req.body;

      const projeto = await Projeto.create({
        nome, descricao, objetivos, metodologia,
        resultadosEsperados, palavrasChave,
        colaboradores, financiamento, orcamento,
        data_inicio, data_fim, imageLink,
        criado_por: usuario.idUsuarios
      });

      return res.status(201).json(projeto);
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      return res.status(500).json({
        error: 'Erro ao criar projeto',
        detalhes: error?.message,
        sql: error?.original?.sql || null,
        params: error?.original?.parameters || error?.original?.bind || null
      });
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
  },

  async listarPorUsuario(req, res) {
    try {
      const { usuarioId } = req.params;

      // Busca apenas os projetos criados por esse usuário
      const projetos = await Projeto.findAll({
        where: { criado_por: usuarioId },
        order: [['data_inicio', 'DESC']] // opcional, apenas para organizar
      });

      res.json(projetos);
    } catch (error) {
      console.error('Erro ao listar projetos do usuário:', error);
      res.status(500).json({
        error: 'Erro ao listar projetos do usuário',
        detalhes: error.message
      });
    }
  },


  async obterPorId(req, res) {
    try {
      const { id } = req.params;

      const projeto = await Projeto.findByPk(id);

      if (!projeto) {
        return res.status(404).json({ error: 'Projeto não encontrado' });
      }

      res.json(projeto);
    } catch (error) {
      console.error('Erro ao obter projeto por ID:', error);
      res.status(500).json({
        error: 'Erro ao obter projeto',
        detalhes: error.message
      });
    }
  }
};
