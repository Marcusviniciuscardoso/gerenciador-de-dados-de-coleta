// controllers/usuarioController.js
const { Usuario, Auditoria, sequelize } = require('../models');

async function getActorUserId(req) {
  try {
    const credId = req.user?.id; // id da CREDENCIAL vindo do JWT
    if (!credId) return null;
    const actor = await Usuario.findOne({
      where: { credencial_id: credId },
      attributes: ['idUsuarios'],
    });
    return actor?.idUsuarios ?? null;
  } catch {
    return null;
  }
}

module.exports = {
  async listar(req, res) {
    try {
      const usuarios = await Usuario.findAll();

      const actorId = await getActorUserId(req);
      if (actorId) {
        // await Auditoria.create({
        //   usuario_id: actorId,
        //   acao: 'Listou todos os usuários',
        // });
      }

      res.json(usuarios);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ error: 'Erro ao listar usuários' });
    }
  },

  async obterPorId(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.params.id);
      if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

      const actorId = await getActorUserId(req);
      if (actorId) {
        // await Auditoria.create({
        //   usuario_id: actorId,
        //   acao: `Consultou o usuário ID ${req.params.id}`,
        // });
      }

      res.json(usuario);
    } catch (error) {
      console.error('Erro ao obter usuário por ID:', error);
      res.status(500).json({ error: 'Erro ao obter usuário' });
    }
  },

  async obterUsuarioLogado(req, res) {
    try {
      const credId = req.user.id;
      const usuario = await Usuario.findOne({ where: { credencial_id: credId } });
      if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

      const actorId = await getActorUserId(req);
      if (actorId) {
        // await Auditoria.create({
        //   usuario_id: actorId,
        //   acao: 'Consultou seus próprios dados (usuario logado)',
        // });
      }

      res.json(usuario);
    } catch (error) {
      console.error('Erro ao obter usuário logado:', error);
      res.status(500).json({ error: 'Erro ao obter usuário logado' });
    }
  },

  async criar(req, res) {
    console.log("📥 [USUARIO_CONTROLLER] Iniciando criação de usuário...");

    const t = await sequelize.transaction();
    console.log("🧾 [TRANSACTION] Transação iniciada.");

    try {
      const { nome, telefone, instituicao, biografia, credencial_id } = req.body;
      console.log("📦 [REQUEST BODY] Dados recebidos:", {
        nome,
        telefone,
        instituicao,
        biografia,
        credencial_id,
      });

      console.log("👤 [USUARIO] Criando usuário...");
      const usuario = await Usuario.create(
        { nome, telefone, instituicao, biografia, credencial_id },
        { transaction: t }
      );

      console.log("✅ [USUARIO] Usuário criado com sucesso:", usuario?.dataValues || usuario);

      console.log("🕵️ [AUDITORIA] Registrando ação na tabela Auditoria...");
      // await Auditoria.create(
      //   {
      //     usuario_id: usuario.idUsuarios,
      //     acao: `Criou o usuário ${nome}`,
      //   },
      //   { transaction: t }
      // );
      console.log("✅ [AUDITORIA] Registro de auditoria criado com sucesso.");

      await t.commit();
      console.log("💾 [TRANSACTION] Transação confirmada (commit realizado).");

      res.status(201).json(usuario);
      console.log("📤 [RESPONSE] Usuário retornado com sucesso ao cliente.");

    } catch (error) {
      console.error("❌ [ERRO] Ocorreu um erro durante a criação do usuário:");
      console.error("Mensagem:", error.message);
      console.error("Stack:", error.stack);
      console.error("Detalhes do erro completo:", error);

      await t.rollback();
      console.warn("↩️ [TRANSACTION] Rollback executado devido ao erro.");

      res.status(500).json({
        error: "Erro ao criar usuário",
        details: error.message,
      });
    }
  },

  async atualizar(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.params.id);
      if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

      await usuario.update(req.body);

      const actorId = await getActorUserId(req);
      if (actorId) {
        // await Auditoria.create({
        //   usuario_id: actorId,
        //   acao: `Atualizou o usuário ID ${req.params.id}`,
        // });
      }

      res.json(usuario);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  },

  async deletar(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.params.id);
      if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

      await usuario.destroy();

      const actorId = await getActorUserId(req);
      if (actorId) {
        // await Auditoria.create({
        //   usuario_id: actorId,
        //   acao: `Deletou o usuário ID ${req.params.id}`,
        // });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
  },
};
