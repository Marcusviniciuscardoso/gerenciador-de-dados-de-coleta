const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/teste', (req, res) => {
  res.send('Rota /usuarios/teste está funcionando');
});

// Lista todos os usuários
router.get('/', usuarioController.listar);

// Busca um usuário específico por ID
router.get('/:id', usuarioController.obterPorId);

// Cria um novo usuário
router.post('/', usuarioController.criar);

// Atualiza um usuário existente
router.put('/:id', usuarioController.atualizar);

// Deleta um usuário
router.delete('/:id', usuarioController.deletar);

module.exports = router;