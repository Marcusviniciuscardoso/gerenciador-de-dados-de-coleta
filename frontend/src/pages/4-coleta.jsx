import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

function Coleta() {
  const { projetoId } = useParams();
  const navigate = useNavigate();

  const [coletas, setColetas] = useState([]);
  const [form, setForm] = useState({
    especie: '',
    local: '',
    data: '',
    hora: '',
    notas: '',
  });
  const [editId, setEditId] = useState(null);

  const carregarColetas = async () => {
    try {
      const response = await api.get(`/coletas?projetoId=${projetoId}`);
      setColetas(response.data);
    } catch (error) {
      console.error('Erro ao carregar coletas', error);
    }
  };

  const salvarColeta = async () => {
    if (!form.especie || !form.local || !form.data || !form.hora) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    try {
      if (editId) {
        await api.put(`/coletas/${editId}`, { ...form, projetoId });
        setEditId(null);
      } else {
        await api.post('/coletas', { ...form, projetoId });
      }

      setForm({
        especie: '',
        local: '',
        data: '',
        hora: '',
        notas: '',
      });

      carregarColetas();
    } catch (error) {
      console.error('Erro ao salvar coleta', error);
    }
  };

  const editar = (coleta) => {
    setForm({
      especie: coleta.especie,
      local: coleta.local,
      data: coleta.data,
      hora: coleta.hora,
      notas: coleta.notas,
    });
    setEditId(coleta.id);
  };

  const excluir = async (id) => {
    if (window.confirm('Deseja realmente excluir essa coleta?')) {
      await api.delete(`/coletas/${id}`);
      carregarColetas();
    }
  };

  useEffect(() => {
    carregarColetas();
  }, [projetoId]);

  return (
    <div className="container">
      <h2>{editId ? 'Editar Coleta' : 'Nova Coleta'}</h2>

      <input
        placeholder="Espécie *"
        value={form.especie}
        onChange={(e) => setForm({ ...form, especie: e.target.value })}
      /><br />

      <input
        placeholder="Local *"
        value={form.local}
        onChange={(e) => setForm({ ...form, local: e.target.value })}
      /><br />

      <input
        type="date"
        value={form.data}
        onChange={(e) => setForm({ ...form, data: e.target.value })}
      /><br />

      <input
        type="time"
        value={form.hora}
        onChange={(e) => setForm({ ...form, hora: e.target.value })}
      /><br />

      <textarea
        placeholder="Notas"
        value={form.notas}
        onChange={(e) => setForm({ ...form, notas: e.target.value })}
      /><br />

      <button onClick={salvarColeta}>
        {editId ? 'Atualizar' : 'Salvar'}
      </button>

      <h3>Coletas Registradas</h3>

      <ul>
        {coletas.map((coleta) => (
          <li key={coleta.id}>
            <strong>{coleta.especie}</strong> - {coleta.local} <br />
            {coleta.data} às {coleta.hora} <br />
            <em>{coleta.notas}</em>
            <br />
            <Link to={`/coleta/${projetoId}/amostras/${coleta.id}`}>
              <button>Ver Amostras</button>
            </Link>
            <button onClick={() => editar(coleta)}>Editar</button>
            <button
              onClick={() => excluir(coleta)}
              style={{ backgroundColor: '#e74c3c', color: 'white' }}
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Coleta;