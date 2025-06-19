const express = require('express');
const router = express.Router();
const projetoController = require('../controllers/projetoController');

// Lista todos os projetos
router.get('/', projetoController.listar);

// Busca um projeto específico por ID
router.get('/:id', projetoController.obterPorId);

// Cria um novo projeto
router.post('/', projetoController.criar);

// Atualiza um projeto existente
router.put('/:id', projetoController.atualizar);

// Deleta um projeto
router.delete('/:id', projetoController.deletar);

module.exports = router;
