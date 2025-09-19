-- Procedures 
-- Aceito
DELIMITER //
CREATE PROCEDURE sp_auditar(
  IN p_usuario_id INT,
  IN p_tabela     VARCHAR(64),
  IN p_registro_id BIGINT,
  IN p_operacao   ENUM('INSERT','UPDATE','DELETE','SELECT'),
  IN p_payload    JSON
)
BEGIN
  INSERT INTO Auditoria (usuario_id, tabela, registro_id, operacao, payload)
  VALUES (p_usuario_id, p_tabela, p_registro_id, p_operacao, p_payload);
END//
DELIMITER ;

-- ==============================================
-- TRIGGERS PARA AUDITORIA COMPLETA
-- ==============================================

-- Trigger para INSERT em amostras
-- Aceito
DELIMITER //
CREATE TRIGGER tr_amostras_ai
AFTER INSERT ON amostras
FOR EACH ROW
BEGIN
  CALL sp_auditar(
    IFNULL(@app_user_id, NULL),
    'amostras',
    NEW.idAmostras, 
    'INSERT',
    JSON_OBJECT('new', JSON_OBJECT(
      'codigo', NEW.codigo, 
      'descricao', NEW.descricao,
      'tipoAmostra', NEW.tipoAmostra,
      'quantidade', NEW.quantidade,
      'coletaId', NEW.coletaId
    ))
  );
END//
DELIMITER ;

-- Trigger para DELETE em amostras
-- Aceito
DELIMITER //
CREATE TRIGGER tr_amostras_ad
AFTER DELETE ON amostras
FOR EACH ROW
BEGIN
  CALL sp_auditar(
    IFNULL(@app_user_id, NULL),
    'amostras',
    OLD.idAmostras,
    'DELETE',
    JSON_OBJECT('old', JSON_OBJECT(
      'codigo', OLD.codigo,
      'descricao', OLD.descricao,
      'tipoAmostra', OLD.tipoAmostra,
      'quantidade', OLD.quantidade
    ))
  );
END//
DELIMITER ;

-- Trigger para UPDATE em amostras 
-- Aceito
DELIMITER //
CREATE TRIGGER	 tr_amostras_aL
AFTER UPDATE ON amostras
FOR EACH ROW
BEGIN 
  CALL sp_auditor(
      IFNULL(@app_user_id, NULL),
      "amostras",
      OLD.idAmostras,
      "UPDATE",
      JSON_OBJECT( 'NEW', JSON_OBJECT( 
        'codigo', NEW.codigo,
        'descricao', NEW.descricao,
        'tipoAmostra', NEW.tipoAmostra,
        'quantidade', NEW.quantidade
      ))
  );
   
END//
DELIMITER;

-- Trigger para projetos (INSERT)
-- Aceito
DELIMITER //
CREATE TRIGGER tr_projetos_ai
AFTER INSERT ON projetos
FOR EACH ROW
BEGIN
  CALL sp_auditar(
    IFNULL(@app_user_id, NULL),
    'projetos',
    NEW.idProjetos,
    'INSERT',
    JSON_OBJECT('new', JSON_OBJECT(
      'nome', NEW.nome,
      'criado_por', NEW.criado_por,
      'data_inicio', NEW.data_inicio,
      'orcamento', NEW.orcamento
    ))
  );
END//
DELIMITER ;

-- Trigger para projetos (UPDATE)
-- Aceito
DELIMITER //
CREATE TRIGGER tr_projetos_ad
AFTER UPDATE ON projetos
FOR EACH ROW 
BEGIN 
   CALL sp_auditar(
    IFNULL(@app_user_id, NULL),
    'projetos',
    OLD.idProjetos,
    'UPDATE',
    JSON_OBJECT('new', JSON_OBJECT(
      'nome', NEW.nome,
      'criado_por', NEW.criado_por,
      'data_inicio', NEW.data_inicio,
      'orcamento', NEW.orcamento
    ))
  );
END//
DELIMITER ;

-- Trigger para projetos (DELETE)
-- Aceito
DELIMITER //
CREATE TRIGGER tr_projetos_al
AFTER DELETE ON projetos
FOR EACH ROW
BEGIN 
  CALL sp_auditar( 
    IFNULL(@app_user_id, NULL),
    'projetos',
    OLD.idProjetos,
    'UPDATE',
    JSON_OBJECT('old', JSON_OBJECT(
      'nome', OLD.nome,
      'criado_por', OLD.criado_por,
      'data_inicio', OLD.data_inicio,
      'orcamento', OLD.orcamento
  ))
  );
END //
DELIMITER ;

-- Trigger para coletas (INSERT)
-- Aceito
DELIMITER //
CREATE TRIGGER tr_coletas_ai
AFTER INSERT ON coletas
FOR EACH ROW
BEGIN
  CALL sp_auditar(
    IFNULL(@app_user_id, NULL),
    'coletas',
    NEW.idColetas,
    'INSERT',
    JSON_OBJECT('new', JSON_OBJECT(
      'projetoId', NEW.projetoId,
      'local', NEW.local,
      'dataColeta', NEW.dataColeta,
      'coletado_por', NEW.coletado_por
    ))
  );
END//
DELIMITER;

-- Trigger para coletas (UPDATE)
-- Aceito
DELIMITER //
CREATE TRIGGER tr_coletas_ad
AFTER UPDATE ON coletas
FOR EACH ROW 
BEGIN 
   CALL sp_auditar(
    IFNULL(@app_user_id, NULL),
    'coletas',
    OLD.idColetas,
    'UPDATE',
    JSON_OBJECT('new', JSON_OBJECT(
      'projetoId', NEW.projetoId,
      'local', NEW.local,
      'dataColeta', NEW.dataColeta,
      'coletado_por', NEW.coletado_por
    ))
  );
END//
DELIMITER;

-- Trigger para coletas (DELETE)
-- Aceito
DELIMITER //
CREATE TRIGGER tr_coletas_al
AFTER DELETE ON coletas
FOR EACH ROW
BEGIN 
   CALL sp_auditar(
    IFNULL(@app_user_id, NULL),
    'coletas',
    OLD.idColetas,
    'DELETE',
    JSON_OBJECT('old', JSON_OBJECT(
      'projetoId', OLD.projetoId,
      'local', OLD.local,
      'dataColeta', OLD.dataColeta,
      'coletado_por', OLD.coletado_por
    ))
  );
END//
DELIMITER;

-- ==============================================
-- TRIGGER PARA VALIDAÇÃO DE DADOS
-- ==============================================

-- Validar datas de projetos
-- Aceito
DELIMITER //
CREATE TRIGGER tr_projetos_data_validacao
BEFORE INSERT ON projetos
FOR EACH ROW
BEGIN
  -- Validar se data_fim é posterior a data_inicio
  IF NEW.data_fim IS NOT NULL AND NEW.data_fim <= NEW.data_inicio THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Data fim deve ser posterior à data início';
  END IF;
  
  -- Validar se data_inicio não é no passado (exceto para projetos históricos)
  IF NEW.data_inicio < CURDATE() - INTERVAL 1 YEAR THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Data início muito antiga';
  END IF;
END//
DELIMITER ;

-- Validar coordenadas geográficas
-- Aceito
DELIMITER //
CREATE TRIGGER tr_coletas_coordenadas_validacao
BEFORE INSERT ON coletas
FOR EACH ROW
BEGIN
  -- Validar latitude (-90 a 90)
  IF NEW.latitude < -90 OR NEW.latitude > 90 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Latitude deve estar entre -90 e 90';
  END IF;
  
  -- Validar longitude (-180 a 180)
  IF NEW.longitude < -180 OR NEW.longitude > 180 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Longitude deve estar entre -180 e 180';
  END IF;
  
  -- Validar se hora_fim é posterior a hora_inicio
  IF NEW.hora_fim <= NEW.hora_inicio THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Hora fim deve ser posterior à hora início';
  END IF;
END//
DELIMITER ;

-- ==============================================
-- PROCEDURES PARA RELATÓRIOS
-- ==============================================

-- Relatório de amostras por projeto
-- Aceito
DELIMITER //
CREATE PROCEDURE sp_relatorio_amostras_projeto(
  IN p_projeto_id INT
)
BEGIN
  SELECT 
    p.nome AS projeto_nome,
    c.local,
    c.dataColeta,
    COUNT(a.idAmostras) as total_amostras,
    GROUP_CONCAT(DISTINCT a.tipoAmostra) as tipos_amostras,
    SUM(a.quantidade) as quantidade_total,
    u.nome as coletor
  FROM projetos p
  JOIN coletas c ON p.idProjetos = c.projetoId
  JOIN amostras a ON c.idColetas = a.coletaId
  JOIN usuarios u ON c.coletado_por = u.idUsuarios
  WHERE p.idProjetos = p_projeto_id
  GROUP BY c.idColetas
  ORDER BY c.dataColeta;
END//
DELIMITER ;

-- Estatísticas gerais do sistema
/*
DELIMITER //
CREATE PROCEDURE sp_estatisticas_sistema()
BEGIN
  SELECT 
    'Usuários' as categoria,
    COUNT(*) as total,
    COUNT(CASE WHEN data_cadastro >= CURDATE() - INTERVAL 30 DAY THEN 1 END) as ultimos_30_dias
  FROM usuarios
  
  UNION ALL
  
  SELECT 
    'Projetos' as categoria,
    COUNT(*) as total,
    COUNT(CASE WHEN data_inicio >= CURDATE() - INTERVAL 30 DAY THEN 1 END) as ultimos_30_dias
  FROM projetos
  
  UNION ALL
  
  SELECT 
    'Coletas' as categoria,
    COUNT(*) as total,
    COUNT(CASE WHEN dataColeta >= CURDATE() - INTERVAL 30 DAY THEN 1 END) as ultimos_30_dias
  FROM coletas
  
  UNION ALL
  
  SELECT 
    'Amostras' as categoria,
    COUNT(*) as total,
    COUNT(CASE WHEN c.dataColeta >= CURDATE() - INTERVAL 30 DAY THEN 1 END) as ultimos_30_dias
  FROM amostras a
  JOIN coletas c ON a.coletaId = c.idColetas;
END//
DELIMITER ;
*/
-- Buscar projetos por localização
/*
DELIMITER //
CREATE PROCEDURE sp_buscar_projetos_por_localizacao(
  IN p_latitude DECIMAL(9,6),
  IN p_longitude DECIMAL(9,6),
  IN p_raio_km DECIMAL(5,2)
)
BEGIN
  SELECT DISTINCT
    p.idProjetos,
    p.nome,
    p.descricao,
    c.local,
    c.latitude,
    c.longitude,
    (6371 * acos(
      cos(radians(p_latitude)) * 
      cos(radians(c.latitude)) * 
      cos(radians(c.longitude) - radians(p_longitude)) + 
      sin(radians(p_latitude)) * 
      sin(radians(c.latitude))
    )) AS distancia_km
  FROM projetos p
  JOIN coletas c ON p.idProjetos = c.projetoId
  HAVING distancia_km <= p_raio_km
  ORDER BY distancia_km;
END//
DELIMITER ;
*/
-- ==============================================
-- FUNCTIONS ÚTEIS
-- ==============================================

-- Calcular duração da coleta em minutos
DELIMITER //
CREATE FUNCTION fn_duracao_coleta(
  p_hora_inicio TIME,
  p_hora_fim TIME
) RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
  RETURN TIMESTAMPDIFF(MINUTE, 
    CONCAT(CURDATE(), ' ', p_hora_inicio),
    CONCAT(CURDATE(), ' ', p_hora_fim)
  );
END//
DELIMITER ;

-- Gerar código único para amostras
/*DELIMITER //
CREATE FUNCTION fn_gerar_codigo_amostra(
  p_projeto_id INT,
  p_coleta_id INT
) RETURNS VARCHAR(50)
READS SQL DATA
DETERMINISTIC
BEGIN
  DECLARE v_codigo VARCHAR(50);
  DECLARE v_contador INT;
  
  -- Contar amostras existentes na coleta
  SELECT COUNT(*) INTO v_contador
  FROM amostras
  WHERE coletaId = p_coleta_id;
  
  -- Gerar código: PROJ-001-COL-001-AMO-001
  SET v_codigo = CONCAT(
    'PROJ-', LPAD(p_projeto_id, 3, '0'),
    '-COL-', LPAD(p_coleta_id, 3, '0'),
    '-AMO-', LPAD(v_contador + 1, 3, '0')
  );
  
  RETURN v_codigo;
END//
DELIMITER ;*/

-- Validar se amostra está dentro do prazo de validade
/*DELIMITER //
CREATE FUNCTION fn_amostra_valida(
  p_validade TIMESTAMP
) RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
  RETURN p_validade > NOW();
END//
DELIMITER ;*/

-- Calcular distância entre dois pontos geográficos
/*DELIMITER //
CREATE FUNCTION fn_distancia_geografica(
  p_lat1 DECIMAL(9,6),
  p_lon1 DECIMAL(9,6),
  p_lat2 DECIMAL(9,6),
  p_lon2 DECIMAL(9,6)
) RETURNS DECIMAL(8,2)
NO SQL
DETERMINISTIC
BEGIN
  RETURN (6371 * acos(
    cos(radians(p_lat1)) * 
    cos(radians(p_lat2)) * 
    cos(radians(p_lon2) - radians(p_lon1)) + 
    sin(radians(p_lat1)) * 
    sin(radians(p_lat2))
  ));
END//
DELIMITER ;*/

-- ==============================================
-- PROCEDURE PARA MANUTENÇÃO
-- ==============================================

-- Limpar auditoria antiga (manter apenas últimos 2 anos)
DELIMITER //
CREATE PROCEDURE sp_limpar_auditoria_antiga()
BEGIN
  DELETE FROM Auditoria 
  WHERE dataHora < DATE_SUB(NOW(), INTERVAL 2 YEAR);
  
  SELECT ROW_COUNT() as registros_removidos;
END//
DELIMITER ;

-- Backup de dados críticos
/*
DELIMITER //
CREATE PROCEDURE sp_backup_dados_projeto(
  IN p_projeto_id INT
)
BEGIN
  -- Criar tabela temporária com dados do projeto
  CREATE TEMPORARY TABLE temp_backup_projeto AS
  SELECT 
    p.nome as projeto,
    p.descricao,
    c.local,
    c.dataColeta,
    c.latitude,
    c.longitude,
    a.codigo as codigo_amostra,
    a.descricao as descricao_amostra,
    a.tipoAmostra,
    a.quantidade,
    u.nome as coletor
  FROM projetos p
  JOIN coletas c ON p.idProjetos = c.projetoId
  JOIN amostras a ON c.idColetas = a.coletaId
  JOIN usuarios u ON c.coletado_por = u.idUsuarios
  WHERE p.idProjetos = p_projeto_id;
  
  -- Retornar dados
  SELECT * FROM temp_backup_projeto;
  
  DROP TEMPORARY TABLE temp_backup_projeto;
END//
DELIMITER ;
*/
-- ==============================================
-- VIEWS ÚTEIS
-- ==============================================

-- View para dashboard principal
CREATE VIEW vw_dashboard_resumo AS
SELECT 
  (SELECT COUNT(*) FROM usuarios) as total_usuarios,
  (SELECT COUNT(*) FROM projetos) as total_projetos,
  (SELECT COUNT(*) FROM projetos WHERE data_fim >= CURDATE()) as projetos_ativos,
  (SELECT COUNT(*) FROM coletas) as total_coletas,
  (SELECT COUNT(*) FROM amostras) as total_amostras,
  (SELECT COUNT(*) FROM amostras WHERE validade < NOW()) as amostras_vencidas;

-- View para amostras com informações completas
CREATE VIEW vw_amostras_completas AS
SELECT 
  a.idAmostras,
  a.codigo,
  a.descricao,
  a.tipoAmostra,
  a.quantidade,
  a.recipiente,
  a.metodoPreservacao,
  a.validade,
  fn_amostra_valida(a.validade) as amostra_valida,
  c.local,
  c.dataColeta,
  c.latitude,
  c.longitude,
  p.nome as projeto_nome,
  u.nome as coletor_nome
FROM amostras a
JOIN coletas c ON a.coletaId = c.idColetas
JOIN projetos p ON c.projetoId = p.idProjetos
JOIN usuarios u ON c.coletado_por = u.idUsuarios;

-- ==============================================
-- EVENTOS AUTOMÁTICOS (SCHEDULER)
-- ==============================================

-- Evento para limpeza automática de auditoria (executar mensalmente)
/*DELIMITER //
CREATE EVENT ev_limpeza_auditoria
ON SCHEDULE EVERY 1 MONTH
STARTS '2025-09-01 02:00:00'
DO
BEGIN
  CALL sp_limpar_auditoria_antiga();
END//
DELIMITER ;

-- Ativar o scheduler se não estiver ativo
-- SET GLOBAL event_scheduler = ON;*/

