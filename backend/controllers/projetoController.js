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
    const t = await Projeto.sequelize.transaction();
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
    }, { transaction: t });

      // 2️⃣ Associa colaboradores (usuários)
      if (Array.isArray(colaboradores) && colaboradores.length > 0) {
        await projeto.addUsuariosColaboradores(colaboradores, { transaction: t });
      }

      // 3️⃣ Associa financiadores
      if (Array.isArray(financiamento) && financiamento.length > 0) {
        await projeto.addFinanciadores(financiamento, { transaction: t });
      }

      // 4️⃣ Associa palavras-chave
      if (Array.isArray(palavrasChave) && palavrasChave.length > 0) {
        // Se vierem como strings, cria as palavras no BD se não existirem
        const palavrasIds = [];
        for (const palavra of palavrasChave) {
          if (typeof palavra === 'string') {
            const [registro] = await PalavraChave.findOrCreate({
              where: { palavra },
              transaction: t
            });
            palavrasIds.push(registro.id);
          } else {
            palavrasIds.push(palavra);
          }
        }
        await projeto.addPalavras(palavrasIds, { transaction: t });
      }

      await t.commit();

      const projetoCompleto = await Projeto.findByPk(projeto.idProjetos, {
        include: [
          { model: Usuario, as: 'usuariosColaboradores', attributes: ['idUsuarios', 'nome'] },
          { model: Financiador, as: 'financiadores', attributes: ['idFinanciadores', 'financiadorNome'] },
          { model: PalavraChave, as: 'palavras', attributes: ['id', 'palavra'] }
        ]
      });

      res.status(201).json(projetoCompleto);
    } catch (error) {
      await t.rollback();
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
  },

  async listarPorUsuario(req, res) {
    try {
      const { usuarioId } = req.params;

      const projetos = await Projeto.findAll({
        where: { criado_por: usuarioId },
        include: [
          { model: Financiador, as: 'financiadores' },
          { model: PalavraChave, as: 'palavras' },
          { model: Usuario, as: 'usuariosColaboradores' }
        ]
      });

      res.json(projetos);
    } catch (error) {
      console.error('Erro ao listar projetos do usuário:', error);
      res.status(500).json({ error: 'Erro ao listar projetos do usuário', detalhes: error.message });
    }
  },

  async obterPorId(req, res) {
    try {
      const { id } = req.params;

      const projeto = await Projeto.findByPk(id, {
        include: [
          { model: Usuario, as: 'usuariosColaboradores', attributes: ['idUsuarios', 'nome'] },
          { model: Financiador, as: 'financiadores', attributes: ['idFinanciadores', 'financiadorNome'] },
          { model: PalavraChave, as: 'palavras', attributes: ['id', 'palavra'] }
        ]
      });

      if (!projeto) {
        return res.status(404).json({ error: 'Projeto não encontrado' });
      }

      res.json(projeto);
    } catch (error) {
      console.error('Erro ao obter projeto por ID:', error);
      res.status(500).json({ error: 'Erro ao obter projeto', detalhes: error.message });
    }
  }
};
