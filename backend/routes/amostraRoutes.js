const express = require('express');
const router = express.Router();
const amostraController = require('../controllers/amostraController');

// Listar todas as amostras
router.get('/', amostraController.listar);

// Buscar uma amostra por ID
router.get('/:id', amostraController.obterPorId);

// Criar uma nova amostra
router.post('/', amostraController.criar);

// Atualizar uma amostra existente
router.put('/:id', amostraController.atualizar);

// Deletar uma amostra
router.delete('/:id', amostraController.deletar);

module.exports = router;
