# 🐛 Sistema de Gerenciamento de Coleta de Dados Científicos

Este projeto é um sistema web desenvolvido para auxiliar pesquisadores no gerenciamento de projetos científicos, registro de coletas de campo, cadastro de amostras, e exportação de dados para planilhas Excel. O sistema também permite armazenar imagens associadas às amostras, garantindo rastreabilidade e organização de dados científicos.

🌐 **Acesse o sistema online:** [Gerenciador de Dados de Coleta](https://gerenciador-de-dados-de-coleta.vercel.app/)

✅ **Funcionalidades principais:**

- Gestão de usuários (login, logout, permissões)
- Cadastro e edição de projetos
- Registro de coletas com dados de localização
- Cadastro detalhado de amostras (incluindo imagens)
- Exportação de dados em formato XLSX
- Interface web responsiva

## 🚀 Tecnologias Utilizadas

- **Frontend:** React.js
- **Backend:** Node.js (Express)
- **Banco de dados:** MySQL
- **ORM:** Sequelize
- **Gerenciamento de pacotes:** npm
- **Exportação Excel:** SheetJS (xlsx)
- **Upload de imagens:** Multer (ou equivalente)

## 🛠️ Passo a Passo para Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/Marcusviniciuscardoso/gerenciador-de-dados-de-coleta.git
cd seu-repositorio
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto backend, com conteúdo similar a:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_DATABASE=nome_do_banco
PORT=3001
JWT_SECRET=chave_segredo
FRONTEND_URL=url_pagina_frontend
```

### 3. Instalar dependências

#### No backend:

```bash
cd backend
npm install
```

#### No frontend:

```bash
cd frontend
npm install
```

### 4. Configurar o banco de dados

- Crie o banco de dados MySQL (se ainda não existir):

```sql
CREATE DATABASE nome_do_banco;
```

- Rode as migrations ou scripts SQL para criar as tabelas.

### 5. Rodar o backend

```bash
cd backend
npm start
```

Por padrão, o backend vai rodar em `http://localhost:3001`.

### 6. Rodar o frontend

Em outro terminal:

```bash
cd frontend
npm start
```

O frontend estará disponível em `http://localhost:3000`.

## 📂 Estrutura de Diretórios

```
/backend
    /controllers
    /models
    /routes
    /uploads
    server.js
/frontend
    /src
        /components
        /pages
        /services
    package.json
.env
README.md
```

## ✅ Requisitos do Sistema

- Node.js >= 18.x
- MySQL >= 8.x
- npm >= 9.x

## 📈 Funcionalidades Futuras

- Dashboard com gráficos
- Controle de versão para dados coletados
- Integração com repositórios institucionais

## 🧑‍💻 Desenvolvedor

- Marcus Vinícius Cardoso Rego
