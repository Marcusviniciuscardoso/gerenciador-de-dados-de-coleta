require('dotenv').config();
const express = require('express');
const app = express();
const { sequelize } = require('./models');

app.use(express.json());

// Rotas
const projetoRoutes = require('./routes/projetoRoutes');
app.use('/projetos', projetoRoutes);

// (Adicione outras rotas aqui: usuarios, coletas, etc.)

// Sincroniza DB
sequelize.sync().then(() => {
  console.log('Database sincronizado');
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
