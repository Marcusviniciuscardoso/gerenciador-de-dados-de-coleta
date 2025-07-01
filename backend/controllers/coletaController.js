const { Coleta, Auditoria } = require('../models');

module.exports = {
  async listar(req, res) {
    try {
      const coletas = await Coleta.findAll();

      // AUDITORIA
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: 'Listou todas as coletas'
      });

      res.json(coletas);
    } catch (error) {
      console.error('Erro ao listar coletas:', error);
      res.status(500).json({ error: 'Erro ao listar coletas', detalhes: error.message });
    }
  },

  async criar(req, res) {
    try {
      const {
        projetoId,
        local,
        latitude,
        longitude,
        dataColeta,
        hora_inicio,
        hora_fim,
        fase_lunar,
        tipo_armadilha,
        observacoes,
        coletado_por
      } = req.body;

      const coleta = await Coleta.create({
        projetoId,
        local,
        latitude,
        longitude,
        dataColeta,
        hora_inicio,
        hora_fim,
        fase_lunar,
        tipo_armadilha,
        observacoes,
        coletado_por
      });

      // AUDITORIA
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: `Criou coleta no local ${coleta.local}`
      });

      res.status(201).json(coleta);
    } catch (error) {
      console.error('Erro ao criar coleta:', error);
      res.status(500).json({ error: 'Erro ao criar coleta', detalhes: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const dados = req.body;

      await Coleta.update(dados, { where: { idColetas: id } });
      const coletaAtualizada = await Coleta.findByPk(id);

      // AUDITORIA
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: `Atualizou coleta ID ${id}`
      });

      res.json(coletaAtualizada);
    } catch (error) {
      console.error('Erro ao atualizar coleta:', error);
      res.status(500).json({ error: 'Erro ao atualizar coleta', detalhes: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;

      await Coleta.destroy({ where: { idColetas: id } });

      // AUDITORIA
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: `Deletou coleta ID ${id}`
      });

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar coleta:', error);
      res.status(500).json({ error: 'Erro ao deletar coleta', detalhes: error.message });
    }
  }
};
