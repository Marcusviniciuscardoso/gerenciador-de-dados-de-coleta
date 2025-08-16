-- Cria o banco se não existir
-- CREATE DATABASE IF NOT EXISTS coleta_dados;
USE railway;

-- Tabelas
-- NF1. O sistema deve permitir o cadastro e login de usuários com autenticação por e-mail e senha.
CREATE TABLE credenciais (
  idCredenciais INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  PRIMARY KEY (idCredenciais)
);
-- NF2. O sistema deve permitir que o usuário edite seus dados pessoais e visualize seu perfil.
-- NF3. O sistema deve registrar a data de cadastro de cada usuário.
CREATE TABLE usuarios (
  idUsuarios INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(50), -- Usar a primeira forma da normalização
  instituicao VARCHAR(255), -- Mais de uma instituição ? Provavelmente não
  biografia TEXT,
  data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  credencial_id INT NOT NULL,
  PRIMARY KEY (idUsuarios),
  FOREIGN KEY (credencial_id) REFERENCES credenciais(idCredenciais)
);
-- 

-- NF4 O sistema deve permitir o cadastro de novos projetos com campos descritivos completos (nome, descrição, objetivos, metodologia, etc.).
-- NF5 O sistema deve associar cada projeto a um usuário criador
--  NF7 O sistema deve permitir associar colaboradores (nomes livres) ao projeto
--  NF8 O sistema deve permitir anexar uma imagem representativa ao projeto
CREATE TABLE projetos (
  idProjetos INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  objetivos TEXT,
  metodologia TEXT,
  resultadosEsperados TEXT,
  palavrasChave TEXT, -- 1 forma de normalização ? 
  colaboradores TEXT NOT NULL,  -- 1 forma de normalização ? 
  financiamento TEXT, -- 1 forma de normalização ? 
  orcamento DECIMAL(10,2),
  data_inicio DATE NOT NULL,
  data_fim DATE,
  criado_por INT NOT NULL,
  imageLink TEXT, -- 1 forma de normalização ? 
  PRIMARY KEY (idProjetos),
  FOREIGN KEY (criado_por) REFERENCES usuarios(idUsuarios)
);

-- Novas adições para a primeira forma de normalização abaixo
CREATE TABLE projeto_financeiros(
   projeto_id INT NOT NULL AUTO_INCREMENT,
   financiadores_id INT NOT NULL AUTO_INCREMENT,
   PRIMARY KEY (projeto_id, financiadores_id),
   FOREIGN KEY (projeto_id) REFERENCES projetos(idProjetos),
   FOREIGN KEY (financiadores_id) REFERENCES financiadores(idFinanciadores)
);

CREATE TABLE financiadores (
   idFinanciadores INT NOT NULL AUTO_INCREMENT,
   financiadorNome VARCHAR(255) NOT NULL,
   PRIMARY KEY (idFinanciadores)
);
-- Ligação direta para entender os colaboradores
CREATE TABLE projeto_usuarios (
  projeto_id INT NOT NULL,
  usuario_id INT NOT NULL,
  PRIMARY KEY (projeto_id, usuario_id),
  FOREIGN KEY (projeto_id) REFERENCES projetos(idProjetos),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(idUsuarios)
);

CREATE TABLE palavras_chave (
  id INT AUTO_INCREMENT PRIMARY KEY,
  palavra VARCHAR(100) NOT NULL
);

CREATE TABLE projeto_palavras_chave (
  projeto_id INT NOT NULL,
  palavra_id INT NOT NULL,
  PRIMARY KEY (projeto_id, palavra_id),
  FOREIGN KEY (projeto_id) REFERENCES projetos(idProjetos),
  FOREIGN KEY (palavra_id) REFERENCES palavras_chave(id)
);
-- Novas adições para a primeira forma de normalização acima


-- NF9 O sistema deve permitir registrar coletas de campo, com dados de localização (latitude, longitude), data, horário e observações.
    
-- NF10 Cada coleta deve ser vinculada a um projeto e a um usuário coletor.
    
-- NF11 O sistema deve permitir listar as coletas associadas a um determinado projeto.
CREATE TABLE coletas (
  idColetas INT NOT NULL AUTO_INCREMENT,
  projetoId INT NOT NULL,
  local VARCHAR(255) NOT NULL,
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  dataColeta DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  observacoes TEXT, -- 1 forma de normalização ? 
  coletado_por INT NOT NULL, -- 1 forma de normalização ? 
  PRIMARY KEY (idColetas),
  FOREIGN KEY (projetoId) REFERENCES projetos(idProjetos),
  FOREIGN KEY (coletado_por) REFERENCES usuarios(idUsuarios)
);

CREATE TABLE amostras (
  idAmostras INT NOT NULL AUTO_INCREMENT,
  coletaId INT NOT NULL,
  codigo VARCHAR(100) NOT NULL,
  descricao TEXT,
  tipoAmostra VARCHAR(100) NOT NULL,
  quantidade DECIMAL NOT NULL,
  recipiente VARCHAR(100) NOT NULL,
  metodoPreservacao VARCHAR(255) NOT NULL, 
  validade TIMESTAMP NOT NULL,
  identificacao_final VARCHAR(255),
  observacoes TEXT, -- 1 forma de normalização ? 
  imageLink TEXT, -- 1 forma de normalização ? 
  PRIMARY KEY (idAmostras),
  FOREIGN KEY (coletaId) REFERENCES coletas(idColetas)
);

CREATE TABLE imagens (
  idImagens INT NOT NULL AUTO_INCREMENT,
  amostraId INT,
  coletaId INT,
  descricao VARCHAR(255),
  PRIMARY KEY (idImagens),
  FOREIGN KEY (amostraId) REFERENCES amostras(idAmostras),
  FOREIGN KEY (coletaId) REFERENCES coletas(idColetas)
);

CREATE TABLE Auditoria (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  acao VARCHAR(255) NOT NULL,
  dataHora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(idUsuarios)
);


-- Dados de teste

-- credenciais
INSERT INTO credenciais (email, senha_hash) VALUES
('admin@teste.com', 'hash_senha_admin'),
('user@teste.com', 'hash_senha_user');

-- usuarios
INSERT INTO usuarios (nome, telefone, instituicao, biografia, credencial_id) VALUES
('Admin User', '123456789', 'Instituto X', 'Administrador do sistema', 1),
('João da Silva', '987654321', 'Universidade Y', 'Pesquisador em biologia', 2);

-- projetos
INSERT INTO projetos (nome, descricao, objetivos, metodologia, resultadosEsperados, palavrasChave, colaboradores, financiamento, orcamento, data_inicio, data_fim, criado_por, imageLink) VALUES
('Projeto Amazônia', 'Estudo de biodiversidade na Amazônia', 'Mapear espécies endêmicas', 'Coletas em campo, análise laboratorial', 'Produzir relatório científico', 'biodiversidade, amazônia', 'João da Silva', 'FAPEAM', '50000', '2025-01-01', '2025-12-31', 2, NULL);

-- coletas
INSERT INTO coletas (projetoId, local, latitude, longitude, dataColeta, hora_inicio, hora_fim, observacoes, coletado_por) VALUES
(1, 'Floresta Nacional do Tapajós', -2.857222, -55.000833, '2025-07-20', '08:30:00', '12:00:00', 'Primeira coleta do projeto.', 2),
(1, 'Estação Ecológica Tapajós', -2.900000, -54.950000, '2025-07-21', '09:00:00', '13:00:00', 'Coleta em área úmida.', 2),
(1, 'Reserva Biológica Tapajós', -2.870000, -55.020000, '2025-07-22', '07:45:00', '11:30:00', 'Coleta em terreno de várzea.', 2);

-- amostras
INSERT INTO amostras (coletaId, codigo, descricao, tipoAmostra, quantidade, recipiente, metodoPreservacao, validade, identificacao_final, observacoes, imageLink) VALUES
(1, 'AMOSTRA-001', 'Folhas coletadas para análise.', 'Folha', '10', 'Saco plástico', 'Geladeira', '2025-12-31', 'Espécie A confirmada', 'Sem observações', NULL),
(2, 'AMOSTRA-002', 'Insetos coletados para estudo.', 'Inseto', '25', 'Pote plástico', 'Álcool 70%', '2025-12-31', 'Espécie B confirmada', 'Armazenar em local fresco.', NULL),
(3, 'AMOSTRA-003', 'Fragmentos de solo coletados.', 'Solo', '3', 'Tubo Falcon', 'Ambiente seco', '2025-12-31', 'Solo ácido identificado', 'Manter fechado.', NULL);
