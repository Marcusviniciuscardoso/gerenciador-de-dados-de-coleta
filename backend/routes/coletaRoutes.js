const express = require('express');
const router = express.Router();
const coletaController = require('../controllers/coletaController');
const auth = require('../middleware/authMiddleware');

// Listar todas as coletas
router.get('/', auth, coletaController.listar);

// Buscar uma coleta por ID
//TODO: Descobrir o erro
router.get('/:id', auth, coletaController.obterPorId);

// Criar uma nova coleta
router.post('/', auth, coletaController.criar);

// Atualizar uma coleta existente
router.put('/:id', auth, coletaController.atualizar);

// Deletar uma coleta
router.delete('/:id', auth, coletaController.deletar);

module.exports = router;
