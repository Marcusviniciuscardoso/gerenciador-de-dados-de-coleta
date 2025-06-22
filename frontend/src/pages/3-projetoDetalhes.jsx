import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProjetoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [projeto, setProjeto] = useState({});
  const [coletas, setColetas] = useState([]);
  const [amostras, setAmostras] = useState([]);

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    try {
      const resProjeto = await axios.get(`http://localhost:3000/projetos/${id}`);
      const resColetas = await axios.get(`http://localhost:3000/coletas`);
      const resAmostras = await axios.get(`http://localhost:3000/amostras`);

      setProjeto(resProjeto.data);
      setColetas(resColetas.data.filter((c) => c.projetoId == id));
      setAmostras(resAmostras.data);
    } catch (error) {
      console.error('Erro ao carregar dados', error);
    }
  };

  const contarAmostrasPorColeta = (coletaId) => {
    return amostras.filter((a) => a.coletaId === coletaId).length;
  };

  const obterDataMaisRecente = () => {
    const datas = coletas.map((c) => new Date(c.data));
    if (datas.length === 0) return null;
    const maisRecente = new Date(Math.max.apply(null, datas));
    const agora = new Date();
    const diff = Math.floor((agora - maisRecente) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Ontem';
    return `${diff} dias atrás`;
  };

  const excluirProjeto = async () => {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      await axios.delete(`http://localhost:3000/projetos/${id}`);
      navigate('/projetos');
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>{projeto.nome}</h1>
          <p>{projeto.descricao}</p>
          <p>Criado em {projeto.data_inicio} — Atualizado em {projeto.data_fim || 'N/A'}</p>
        </div>
        <div>
          <button onClick={() => navigate(`/projeto/editar/${id}`)} style={{ marginRight: '10px' }}>
            ✏️ Editar
          </button>
          <button onClick={excluirProjeto} style={{ backgroundColor: '#e74c3c', color: 'white' }}>
            🗑️ Excluir
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
        <div className="card">
          <h3>Coletas Realizadas</h3>
          <p style={{ fontSize: '24px' }}>{coletas.length}</p>
        </div>
        <div className="card">
          <h3>Amostras Coletadas</h3>
          <p style={{ fontSize: '24px' }}>
            {coletas.reduce((acc, coleta) => acc + contarAmostrasPorColeta(coleta.id), 0)}
          </p>
        </div>
        <div className="card">
          <h3>Última Coleta</h3>
          <p style={{ fontSize: '24px' }}>{obterDataMaisRecente() || 'Sem coletas'}</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Coletas Recentes</h2>
        <button onClick={() => navigate(`/coleta/nova/${id}`)} style={{ backgroundColor: '#000', color: '#fff' }}>
          + Nova Coleta
        </button>
      </div>

      <div>
        {coletas.map((coleta) => (
          <div key={coleta.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <h3>{coleta.especie}</h3>
            <p>{coleta.local}</p>
            <p>
              {coleta.data} — {coleta.hora} — {coleta.registrado_por}
            </p>
            <span style={{
              backgroundColor: '#eee',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '12px'
            }}>
              {contarAmostrasPorColeta(coleta.id)} amostras
            </span>
            <br /><br />
            <button onClick={() => navigate(`/coleta/${coleta.id}`)}>Ver Detalhes</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjetoDetalhes;