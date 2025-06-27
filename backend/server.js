require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const http = require('http');

const app = express();
const sequelize = require('./config/database');

// Middlewares
app.use(express.json());
app.use(cors());

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

// 🔐 HTTPS Configuração
const httpsOptions = {
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem')
};

// 🚀 Inicializa HTTPS
https.createServer(httpsOptions, app).listen(3000, () => {
  console.log('🔐 Servidor rodando em HTTPS na porta 3000');
});

// (Opcional) HTTP como fallback na porta 8080
http.createServer(app).listen(8080, () => {
  console.log('🌐 Servidor rodando em HTTP na porta 8080');
});

// 🗄️ Sincroniza DB
sequelize.sync().then(() => {
  console.log('✅ Database sincronizado com sucesso!');
}).catch((err) => {
  console.error('❌ Erro ao sincronizar database:', err);
});
