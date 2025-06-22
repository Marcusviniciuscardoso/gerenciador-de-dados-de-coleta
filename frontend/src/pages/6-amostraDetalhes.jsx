import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Amostra() {
  const [amostras, setAmostras] = useState([]);
  const [form, setForm] = useState({ descricao: '', coletaId: '' });

  const fetchAmostras = async () => {
    const res = await axios.get('http://localhost:3000/amostras');
    setAmostras(res.data);
  };

  const salvar = async () => {
    await axios.post('http://localhost:3000/amostras', form);
    setForm({ descricao: '', coletaId: '' });
    fetchAmostras();
  };

  const excluir = async (id) => {
    await axios.delete(`http://localhost:3000/amostras/${id}`);
    fetchAmostras();
  };

  useEffect(() => {
    fetchAmostras();
  }, []);

  return (
    <div className="container">
      <h2>Amostras</h2>

      <input placeholder="Descrição" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
      <input placeholder="ID da Coleta" value={form.coletaId} onChange={e => setForm({ ...form, coletaId: e.target.value })} />
      <br />
      <button onClick={salvar}>Salvar Amostra</button>

      <ul>
        {amostras.map(a => (
          <li key={a.id}>
            <strong>{a.descricao}</strong> - Coleta: {a.coletaId}
            <br />
            <button onClick={() => excluir(a.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Amostra;