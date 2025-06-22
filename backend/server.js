require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { sequelize } = require('./config/database');

// Middlewares
app.use(express.json());
app.use(cors());

// Rotas
const projetoRoutes = require('./routes/projetoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const coletaRoutes = require('./routes/coletaRoutes');
const amostraRoutes = require('./routes/amostraRoutes');
const imagemRoutes = require('./routes/imagemRoutes');

app.use('/projetos', projetoRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/coletas', coletaRoutes);
app.use('/amostras', amostraRoutes);
app.use('/imagens', imagemRoutes);

// Sincroniza DB
sequelize.sync().then(() => {
  console.log('Database sincronizado com sucesso!');
}).catch((err) => {
  console.error('Erro ao sincronizar database:', err);
});

// Inicia servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
