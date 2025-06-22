import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Projeto() {
  const [projetos, setProjetos] = useState([]);
  const [coletas, setColetas] = useState([]);
  const [amostras, setAmostras] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resProjetos, resColetas, resAmostras, resUsuarios] = await Promise.all([
        axios.get('http://localhost:3000/projetos'),
        axios.get('http://localhost:3000/coletas'),
        axios.get('http://localhost:3000/amostras'),
        axios.get('http://localhost:3000/usuarios'),
      ]);

      setProjetos(resProjetos.data);
      setColetas(resColetas.data);
      setAmostras(resAmostras.data);
      setUsuarios(resUsuarios.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const contarColetasPorProjeto = (projetoId) => {
    return coletas.filter((c) => c.projetoId === projetoId).length;
  };

  const contarAmostrasPorProjeto = (projetoId) => {
    const coletasDoProjeto = coletas.filter((c) => c.projetoId === projetoId);
    return amostras.filter((a) => coletasDoProjeto.some((c) => c.id === a.coletaId)).length;
  };

  const acessarProjeto = (id) => {
    navigate(`/projeto/${id}`);
  };

  const criarProjeto = () => {
    navigate('/projeto/novo');
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Sistema de Coleta Científica</h1>
          <p>Gerencie seus projetos de pesquisa e coletas de campo</p>
        </div>
        <button onClick={criarProjeto} style={{ backgroundColor: '#000', color: '#fff', padding: '10px 20px' }}>
          + Novo Projeto
        </button>
      </div>

      <div className="dashboard" style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
        <div className="card">
          <h3>Projetos Ativos</h3>
          <p style={{ fontSize: '24px' }}>{projetos.length}</p>
        </div>
        <div className="card">
          <h3>Coletas Realizadas</h3>
          <p style={{ fontSize: '24px' }}>{coletas.length}</p>
        </div>
        <div className="card">
          <h3>Amostras Coletadas</h3>
          <p style={{ fontSize: '24px' }}>{amostras.length}</p>
        </div>
        <div className="card">
          <h3>Pesquisadores</h3>
          <p style={{ fontSize: '24px' }}>{usuarios.length}</p>
        </div>
      </div>

      <h2>Projetos Recentes</h2>

      <div className="grid" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {projetos.map((projeto) => (
          <div key={projeto.id} className="projeto-card" style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            width: '300px',
            backgroundColor: '#f9f9f9'
          }}>
            <h3>{projeto.nome}</h3>
            <p>{projeto.descricao}</p>
            <p><strong>{contarColetasPorProjeto(projeto.id)}</strong> coletas | <strong>{contarAmostrasPorProjeto(projeto.id)}</strong> amostras</p>
            <button onClick={() => acessarProjeto(projeto.id)}>Ver Detalhes</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projeto;
