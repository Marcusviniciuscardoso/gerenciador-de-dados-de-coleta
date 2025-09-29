const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Credencial = require('../models/credencial')(sequelize, DataTypes);
const Auditoria = require('../models/auditoria')(sequelize, DataTypes);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET

module.exports = {
    async criarCredencial(req, res) {
        const { email, senha } = req.body;

        try {
            const hash = await bcrypt.hash(senha, 10);

            const novaCredencial = await Credencial.create({
                email,
                senha_hash: hash
            });

            // AUDITORIA
            /*await Auditoria.create({
                usuario_id: email,
                acao: `Criou uma nova credencial`
            });*/

            res.status(201).json(novaCredencial);
        } catch (error) {
            console.error('Erro ao criar credencial:', error);
            res.status(500).json({ error: 'Erro ao criar credencial', details: error.message });
        }
    },

    async login(req, res) {
        const { email, senha } = req.body;

        try {
            const credencial = await Credencial.findOne({ where: { email } });

            if (!credencial) {
                return res.status(404).json({ error: 'Credencial não encontrada' });
            }

            const senhaValida = await bcrypt.compare(senha, credencial.senha_hash);

            if (!senhaValida) {
                return res.status(401).json({ error: 'Senha incorreta' });
            }

            const token = jwt.sign(
                { id: credencial.idCredenciais, email: credencial.email },
                SECRET,
                { expiresIn: '7d' }
            );

            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 3600000,
            });


            // AUDITORIA
            await Auditoria.create({
                usuario: email,
                acao: `Realizou login no sistema`
            });

            res.json({ message: 'Login bem-sucedido', token });
        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({ error: 'Erro no login', details: error.message });
        }
    },

    async logout(req, res) {
        try {
            const email = req.user?.email || 'desconhecido';

            // AUDITORIA
            await Auditoria.create({
                usuario: email,
                acao: `Realizou logout no sistema`
            });

            res.clearCookie('token');
            res.json({ message: 'Logout realizado com sucesso' });
        } catch (error) {
            console.error('Erro ao realizar logout:', error);
            res.status(500).json({ error: 'Erro ao realizar logout', details: error.message });
        }
    },

    async listarCredenciais(req, res) {
        try {
            const credenciais = await Credencial.findAll();

            await Auditoria.create({
                usuario: req.user?.email || 'desconhecido',
                acao: `Listou todas as credenciais`
            });

            res.json(credenciais);
        } catch (error) {
            console.error('Erro ao listar credenciais:', error);
            res.status(500).json({ error: 'Erro ao listar credenciais', details: error.message });
        }
    },

    async buscarCredencialPorId(req, res) {
        const { id } = req.params;

        try {
            const credencial = await Credencial.findByPk(id);

            if (!credencial) {
                return res.status(404).json({ error: 'Credencial não encontrada' });
            }

            await Auditoria.create({
                usuario: req.user?.email || 'desconhecido',
                acao: `Consultou credencial ID ${id}`
            });

            res.json(credencial);
        } catch (error) {
            console.error('Erro ao buscar credencial:', error);
            res.status(500).json({ error: 'Erro ao buscar credencial', details: error.message });
        }
    },

    async atualizarCredencial(req, res) {
        const { id } = req.params;
        const { email, senha } = req.body;

        try {
            const credencial = await Credencial.findByPk(id);

            if (!credencial) {
                return res.status(404).json({ error: 'Credencial não encontrada' });
            }

            if (email) credencial.email = email;
            if (senha) credencial.senha_hash = await bcrypt.hash(senha, 10);

            await credencial.save();

            await Auditoria.create({
                usuario: req.user?.email || 'desconhecido',
                acao: `Atualizou credencial ID ${id}`
            });

            res.json({ message: 'Credencial atualizada com sucesso', credencial });
        } catch (error) {
            console.error('Erro ao atualizar credencial:', error);
            res.status(500).json({ error: 'Erro ao atualizar credencial', details: error.message });
        }
    },

    async deletarCredencial(req, res) {
        const { id } = req.params;

        try {
            const credencial = await Credencial.findByPk(id);

            if (!credencial) {
                return res.status(404).json({ error: 'Credencial não encontrada' });
            }

            await credencial.destroy();

            await Auditoria.create({
                usuario: req.user?.email || 'desconhecido',
                acao: `Deletou credencial ID ${id}`
            });

            res.json({ message: 'Credencial deletada com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar credencial:', error);
            res.status(500).json({ error: 'Erro ao deletar credencial', details: error.message });
        }
    },
};
