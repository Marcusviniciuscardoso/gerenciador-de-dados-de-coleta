require('dotenv').config({ path: './.env' });

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');

const app = express();

// Middlewares
app.use(express.json());

const allowedOrigins = [
  "https://gerenciador-de-dados-de-coleta.vercel.app",
  "http://localhost:3000"
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(cookieParser());

// 🔗 Rotas
const credencialRoutes = require('./routes/credencialRoutes');
const projetoRoutes = require('./routes/projetoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const coletaRoutes = require('./routes/coletaRoutes');
const amostraRoutes = require('./routes/amostraRoutes');
const cadastroRoute = require('./routes/cadastroRoutes');
const uploadRoutes = require("./routes/uploadRoutes");

// const imagemRoutes = require('./routes/imagemRoutes');

app.use('/credenciais', credencialRoutes);
app.use('/projetos', projetoRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/cadastro', cadastroRoute);
app.use('/coletas', coletaRoutes);
app.use('/amostras', amostraRoutes);
app.use("/uploads", uploadRoutes);
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
