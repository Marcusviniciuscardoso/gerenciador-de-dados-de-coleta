const express = require('express');
const router = express.Router();
const cadastroController = require('../controllers/cadastroController');

// Essa rota não precisa de autenticação
router.post('/cadastro-completo', cadastroController.cadastrarUsuarioComCredencial);

module.exports = router;
