const { Amostra } = require('../models');

module.exports = {
  async listar(req, res) {
    try {
      const amostras = await Amostra.findAll();
      res.json(amostras);
    } catch (error) {
      console.error('Erro ao listar amostras:', error);
      res.status(500).json({ error: 'Erro ao listar amostras' });
    }
  },

  async criar(req, res) {
    try {
      const {
        coletaId,
        codigo,
        descricao,
        tipoAmostra,
        quantidade,
        recipiente,
        metodoPreservacao,
        validade,
        identificacao_final,
        observacoes,
        imageLink
      } = req.body;

      const amostra = await Amostra.create({
        coletaId,
        codigo,
        descricao,
        tipoAmostra,
        quantidade,
        recipiente,
        metodoPreservacao,
        validade,
        identificacao_final,
        observacoes,
        imageLink
      });

      res.status(201).json(amostra);
    } catch (error) {
      console.error('Erro ao criar amostra:', error);
      res.status(500).json({ error: 'Erro ao criar amostra', detalhes: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const dados = req.body;

      await Amostra.update(dados, { where: { idAmostras: id } });
      const amostraAtualizada = await Amostra.findByPk(id);
      res.json(amostraAtualizada);
    } catch (error) {
      console.error('Erro ao atualizar amostra:', error);
      res.status(500).json({ error: 'Erro ao atualizar amostra' });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      await Amostra.destroy({ where: { idAmostras: id } });
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar amostra:', error);
      res.status(500).json({ error: 'Erro ao deletar amostra' });
    }
  }
};
