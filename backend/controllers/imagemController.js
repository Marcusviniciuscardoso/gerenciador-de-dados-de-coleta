const { Imagem } = require('../models');
const { Auditoria } = require('../models');

module.exports = {
  async listar(req, res) {
    try {
      const imagens = await Imagem.findAll();

      // AUDITORIA
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: 'Listou todas as imagens'
      });

      res.json(imagens);
    } catch (error) {
      console.error('Erro ao listar imagens:', error);
      res.status(500).json({ error: 'Erro ao listar imagens' });
    }
  },

  async criar(req, res) {
    try {
      const { amostraId, coletaId, arquivo_base64, descricao } = req.body;

      const imagem = await Imagem.create({
        amostraId, coletaId, arquivo_base64, descricao
      });

      // AUDITORIA
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: `Criou imagem vinculada à amostra ${amostraId} ou coleta ${coletaId}`
      });

      res.status(201).json(imagem);
    } catch (error) {
      console.error('Erro ao criar imagem:', error);
      res.status(500).json({ error: 'Erro ao criar imagem' });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const dados = req.body;

      await Imagem.update(dados, { where: { idImagens: id } });
      const imagemAtualizada = await Imagem.findByPk(id);

      // AUDITORIA
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: `Atualizou imagem ID ${id}`
      });

      res.json(imagemAtualizada);
    } catch (error) {
      console.error('Erro ao atualizar imagem:', error);
      res.status(500).json({ error: 'Erro ao atualizar imagem' });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      await Imagem.destroy({ where: { idImagens: id } });

      // AUDITORIA
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: `Deletou imagem ID ${id}`
      });

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      res.status(500).json({ error: 'Erro ao deletar imagem' });
    }
  }
};
