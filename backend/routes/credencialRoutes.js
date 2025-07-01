const express = require('express');
const router = express.Router();
const credencialController = require('../controllers/credencialController');
const { body } = require('express-validator');
const auth = require('../middleware/authMiddleware');

// Login (público)
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('senha').notEmpty().withMessage('Senha obrigatória')
  ],
  credencialController.login
);

// Registrar (público)
router.post(
  '/registrar',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('senha')
      .isLength({ min: 6 })
      .withMessage('A senha deve ter no mínimo 6 caracteres')
  ],
  credencialController.criarCredencial
);

// ⚠️ Rotas abaixo protegidas!
router.get('/', auth, credencialController.listarCredenciais);

router.get('/:id', auth, credencialController.buscarCredencialPorId);

router.put('/:id', auth, credencialController.atualizarCredencial);

router.delete('/:id', auth, credencialController.deletarCredencial);

module.exports = router;
