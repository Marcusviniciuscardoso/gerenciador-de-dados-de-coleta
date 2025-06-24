const express = require('express');
const router = express.Router();
const credencialController = require('../controllers/credencialController');

// Fazer login
router.post('/login', credencialController.login);

// Registrar
router.post('/registrar', credencialController.criarCredencial);

// Listar todas as credenciais (admin)
router.get('/', credencialController.listarCredenciais);

// Buscar por ID
router.get('/:id', credencialController.buscarCredencialPorId);

// Atualizar
router.put('/:id', credencialController.atualizarCredencial);

// Deletar
router.delete('/:id', credencialController.deletarCredencial);

module.exports = router;
