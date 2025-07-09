require('dotenv').config({ path: './.env' });

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL, // ajuste isso para o domínio Railway depois!
  credentials: true
}));
app.use(cookieParser());

// 🔗 Rotas
const credencialRoutes = require('./routes/credencialRoutes');
const projetoRoutes = require('./routes/projetoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const coletaRoutes = require('./routes/coletaRoutes');
const amostraRoutes = require('./routes/amostraRoutes');
// const imagemRoutes = require('./routes/imagemRoutes');

app.use('/credenciais', credencialRoutes);
app.use('/projetos', projetoRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/coletas', coletaRoutes);
app.use('/amostras', amostraRoutes);
// app.use('/imagens', imagemRoutes);

// 🚀 Inicializa servidor HTTP (Railway fornece HTTPS externamente)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🌐 Servidor rodando na porta ${PORT}`);
});

// 🗄️ Sincroniza DB
sequelize.sync().then(() => {
  console.log('✅ Database sincronizado com sucesso!');
}).catch((err) => {
  console.error('❌ Erro ao sincronizar database:', err);
});
