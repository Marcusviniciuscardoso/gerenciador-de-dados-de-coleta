const express = require('express');
const router = express.Router();
const projetoController = require('../controllers/projetoController');
const auth = require('../middleware/authMiddleware');

// Lista todos os projetos
router.get('/', auth, projetoController.listar);

// Busca um projeto específico por ID
//TODO: Entender qual o erro aqui
router.get('/:id', auth, projetoController.obterPorId);

// Cria um novo projeto
router.post('/', auth, projetoController.criar);

// Atualiza um projeto existente
router.put('/:id', auth, projetoController.atualizar);

// Deleta um projeto
router.delete('/:id', auth, projetoController.deletar);

module.exports = router;