const { Usuario, Auditoria } = require('../models');

module.exports = {
  async listar(req, res) {
    try {
      const usuarios = await Usuario.findAll();

      // AUDITORIA
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: 'Listou todos os usuários'
      });

      res.json(usuarios);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ error: 'Erro ao listar usuários' });
    }
  },

  async obterPorId(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.params.id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // AUDITORIA
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: `Consultou o usuário ID ${req.params.id}`
      });

      res.json(usuario);
    } catch (error) {
      console.error('Erro ao obter usuário por ID:', error);
      res.status(500).json({ error: 'Erro ao obter usuário' });
    }
  },

  async obterUsuarioLogado(req, res) {
    try {
      const userId = req.user.id;
      console.log("UserID: ", userId);
      const usuario = await Usuario.findOne({
        where: { credencial_id: userId }
      });
      console.log("Usuario: ", usuario);

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // AUDITORIA
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: `Consultou seus próprios dados (usuario logado)`
      });

      res.json(usuario);
    } catch (error) {
      console.error('Erro ao obter usuário logado:', error);
      res.status(500).json({ error: 'Erro ao obter usuário logado' });
    }
  },

  async criar(req, res) {
    try {
      const { nome, telefone, instituicao, biografia, credencial_id } = req.body;
      const usuario = await Usuario.create({ nome, telefone, instituicao, biografia, credencial_id });

      // AUDITORIA
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: `Criou o usuário ${nome}`
      });

      res.status(201).json(usuario);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  },

  async atualizar(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.params.id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      await usuario.update(req.body);

      // AUDITORIA
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: `Atualizou o usuário ID ${req.params.id}`
      });

      res.json(usuario);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  },

  async deletar(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.params.id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      await usuario.destroy();

      // AUDITORIA
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: `Deletou o usuário ID ${req.params.id}`
      });

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
  }
};
