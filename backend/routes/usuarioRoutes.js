const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const auth = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Teste simples (aberto)
router.get('/teste', (req, res) => {
  res.send('Rota /usuarios/teste está funcionando');
});

// Pega dados do usuário logado
router.get('/me', auth, usuarioController.obterUsuarioLogado);

// Lista todos os usuários
router.get('/', auth, usuarioController.listar);

// Busca um usuário específico por ID
router.get('/:id', auth, usuarioController.obterPorId);

// Cria usuário (se desejar deixar público, remova o `auth` daqui)
router.post(
  '/',
  auth,
  [
    body('nome').notEmpty().withMessage('O nome é obrigatório'),
    body('email').isEmail().withMessage('O email deve ser válido'),
    body('telefone').optional().isMobilePhone('pt-BR').withMessage('Telefone inválido'),
    body('senha').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres')
  ],
  usuarioController.criar
);

// Atualiza um usuário existente
router.put('/:id', auth, usuarioController.atualizar);

// Deleta um usuário
router.delete('/:id', auth, usuarioController.deletar);

module.exports = router;
