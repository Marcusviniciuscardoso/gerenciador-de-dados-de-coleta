import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Coleta() {
  const { id, collectionId } = useParams();
  const navigate = useNavigate();
  const [coleta, setColeta] = useState(null);
  const [amostras, setAmostras] = useState([]);

  useEffect(() => {
    carregarColeta();
    carregarAmostras();
  }, [collectionId]);

  const carregarColeta = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/coletas/${collectionId}`);
      setColeta(response.data);
    } catch (error) {
      console.error('Erro ao carregar coleta:', error);
    }
  };

  const carregarAmostras = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/amostras?coletaId=${collectionId}`);
      setAmostras(response.data);
    } catch (error) {
      console.error('Erro ao carregar amostras:', error);
    }
  };

  const excluirColeta = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta coleta?')) {
      await axios.delete(`http://localhost:3000/coletas/${collectionId}`);
      navigate(`/projeto/${id}`);
    }
  };

  if (!coleta) return <p>Carregando...</p>;

  return (
    <div className="container">
      <nav>
        <Link to={`/projeto/${id}`}>← Voltar para Projeto</Link>
      </nav>

      <h2>{coleta.especie}</h2>
      <p>{coleta.local}</p>
      <p>
        {new Date(coleta.data).toLocaleDateString()} às {coleta.hora} — {coleta.registrado_por}
      </p>

      <div className="info-cards">
        <div><strong>Amostras Coletadas:</strong> {amostras.length}</div>
        <div><strong>Imagens Anexadas:</strong> {/* contar imagens */} 0</div>
        <div><strong>Data da Coleta:</strong> {new Date(coleta.data).toLocaleDateString()}</div>
      </div>

      <section>
        <h3>Observações</h3>
        <p>{coleta.notas || 'Nenhuma observação registrada.'}</p>
      </section>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3>Amostras</h3>
          <Link to={`/coleta/${collectionId}/nova-amostra`}>
            <button>+ Nova Amostra</button>
          </Link>
        </div>
        {amostras.length === 0 ? (
          <p>Nenhuma amostra cadastrada.</p>
        ) : (
          amostras.map((amostra) => (
            <div key={amostra.id} className="amostra-card">
              <h4>{amostra.descricao}</h4>
              <p><strong>Código:</strong> {amostra.codigo}</p>
              <p><strong>Recipiente:</strong> {amostra.recipiente}</p>
              <p>{amostra.observacoes}</p>
              <Link to={`/amostra/${amostra.id}`}>
                <button>Ver Detalhes</button>
              </Link>
            </div>
          ))
        )}
      </section>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate(`/coleta/${collectionId}/editar`)}>Editar</button>
        <button onClick={excluirColeta} style={{ backgroundColor: '#e74c3c', color: 'white', marginLeft: '10px' }}>
          Excluir
        </button>
      </div>
    </div>
  );
}

export default Coleta;
