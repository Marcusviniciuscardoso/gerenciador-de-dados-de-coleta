const { Amostra /*, Auditoria*/ } = require('../models'); // Comentado Auditoria para desativar auditoria temporariamente

module.exports = {
  async listar(req, res) {
    try {
      const amostras = await Amostra.findAll();

      // REGISTRO DE AUDITORIA
      /*
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: 'Listou todas as amostras'
      });
      */

      res.json(amostras);
    } catch (error) {
      console.error('Erro ao listar amostras:', error);
      res.status(500).json({ error: 'Erro ao listar amostras' });
    }
  },

  async obterPorId(req, res) {
    console.log("[obterPorId] >>> INÍCIO");
    console.log("[obterPorId] req.params =", req.params);

    try {
      const { id } = req.params;
      console.log("[obterPorId] id extraído =", id, "| tipo:", typeof id);

      // Se você espera número, ajuda a ver se vem "undefined" ou string estranha
      const coletaId = Number(id);
      console.log("[obterPorId] coletaId (Number) =", coletaId, "| isNaN:", Number.isNaN(coletaId));

      console.log("[obterPorId] Antes do findAll - buscando amostras por coletaId...");
      const amostra = await Amostra.findAll({
        where: { coletaId: id }, // ou coletaId, se seu campo for numérico
      });

      console.log("[obterPorId] Depois do findAll");
      console.log("[obterPorId] Resultado bruto:", amostra);
      console.log("[obterPorId] Array?", Array.isArray(amostra), "| length:", Array.isArray(amostra) ? amostra.length : "N/A");

      // ⚠️ findAll SEMPRE retorna array. Se não encontrar, vem [] (truthy).
      // Então o seu "if (!amostra)" nunca vai disparar.
      if (!amostra || (Array.isArray(amostra) && amostra.length === 0)) {
        console.log("[obterPorId] Nenhuma amostra encontrada para coletaId =", id);
        return res.status(404).json({ error: "Amostra não encontrada" });
      }

      console.log("[obterPorId] Respondendo com JSON. Quantidade:", amostra.length);
      // REGISTRO DE AUDITORIA (comentado)
      /*
      console.log("[obterPorId] Auditoria: criando registro...");
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: `Consultou a amostra ID ${id}`
      });
      console.log("[obterPorId] Auditoria: registro criado!");
      */

      res.json(amostra);
      console.log("[obterPorId] <<< FIM (sucesso)");
    } catch (error) {
      console.error("[obterPorId] !!! ERRO no try/catch");
      console.error("[obterPorId] error =", error);
      console.error("[obterPorId] error.message =", error?.message);

      res.status(500).json({
        error: "Erro ao obter amostra",
        detalhes: error?.message,
      });

      console.log("[obterPorId] <<< FIM (erro 500)");
    }
  },


  async criar(req, res) {
    try {
      console.log("Olha o req body: ", req.body)
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

      // REGISTRO DE AUDITORIA
      /*
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: `Criou amostra ${amostra.codigo}`
      });
      */

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

      // REGISTRO DE AUDITORIA
      /*
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: `Atualizou amostra ID ${id}`
      });
      */

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

      // REGISTRO DE AUDITORIA
      /*
      await Auditoria.create({
        usuario: req.user?.email || 'desconhecido',
        acao: `Deletou amostra ID ${id}`
      });
      */

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar amostra:', error);
      res.status(500).json({ error: 'Erro ao deletar amostra' });
    }
  }
};
