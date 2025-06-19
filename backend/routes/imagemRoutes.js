const express = require('express');
const router = express.Router();
const imagemController = require('../controllers/imagemController');

// Listar todas as imagens
router.get('/', imagemController.listar);

// Buscar uma imagem por ID
router.get('/:id', imagemController.obterPorId);

// Criar uma nova imagem
router.post('/', imagemController.criar);

// Atualizar uma imagem existente
router.put('/:id', imagemController.atualizar);

// Deletar uma imagem
router.delete('/:id', imagemController.deletar);

module.exports = router;
