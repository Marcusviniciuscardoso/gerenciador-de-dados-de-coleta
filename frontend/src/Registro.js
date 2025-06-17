import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from './db/database';
import './App.css';

function Registro() {
  const { coletaId, pastaId } = useParams();
  const [coleta, setColeta] = useState(null);

  useEffect(() => {
    const buscar = async () => {
      const resultado = await db.coletas.get(Number(coletaId));
      setColeta(resultado);
    };
    buscar();
  }, [coletaId]);

  if (!coleta) {
    return <div className="container">Carregando...</div>;
  }

  return (
    <div className="container">
      <h2>Detalhes da Coleta</h2>
      <p><strong>Espécie:</strong> {coleta.especie}</p>
      <p><strong>Local:</strong> {coleta.local}</p>
      <p><strong>Data:</strong> {coleta.data}</p>
      <p><strong>Hora:</strong> {coleta.hora}</p>
      <p><strong>Notas:</strong> {coleta.notas}</p>
      <p><strong>Registrado por:</strong> {coleta.registrado_por}</p>
      {coleta.imagem && (
        <img src={coleta.imagem} alt="Foto da coleta" style={{ maxWidth: '100%', borderRadius: '6px' }} />
      )}
      <br />
      <Link to={`/coleta/${pastaId}`}>
        <button style={{ marginTop: '20px' }}>Voltar para Coletas</button>
      </Link>
    </div>
  );
}

export default Registro;
