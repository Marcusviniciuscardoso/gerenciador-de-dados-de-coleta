const express = require('express');
const router = express.Router();
const amostraController = require('../controllers/amostraController');
const auth = require('../middleware/authMiddleware');

// Listar todas as amostras
router.get('/', auth, amostraController.listar);

// Buscar uma amostra por ID
//TODO: Descobrir o BUG
//router.get('/:id', amostraController.obterPorId);

// Criar uma nova amostra
router.post('/', auth, amostraController.criar);

// Atualizar uma amostra existente
router.put('/:id', auth, amostraController.atualizar);

// Deletar uma amostra
router.delete('/:id', auth, amostraController.deletar);

module.exports = router;
