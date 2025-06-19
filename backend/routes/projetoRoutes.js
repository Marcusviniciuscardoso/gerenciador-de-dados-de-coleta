const express = require('express');
const router = express.Router();
const projetoController = require('../controllers/projetoController');

router.get('/', projetoController.listar);
router.post('/', projetoController.criar);
router.put('/:id', projetoController.atualizar);
router.delete('/:id', projetoController.deletar);

module.exports = router;
