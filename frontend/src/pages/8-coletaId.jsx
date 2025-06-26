/*import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

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
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{editId ? 'Editar Coleta' : 'Nova Coleta'}</h2>

      <div className="bg-white rounded shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Espécie *"
            value={form.especie}
            onChange={(e) => setForm({ ...form, especie: e.target.value })}
            className="border rounded px-4 py-2 w-full"
          />

          <input
            placeholder="Local *"
            value={form.local}
            onChange={(e) => setForm({ ...form, local: e.target.value })}
            className="border rounded px-4 py-2 w-full"
          />

          <input
            type="date"
            value={form.data}
            onChange={(e) => setForm({ ...form, data: e.target.value })}
            className="border rounded px-4 py-2 w-full"
          />

          <input
            type="time"
            value={form.hora}
            onChange={(e) => setForm({ ...form, hora: e.target.value })}
            className="border rounded px-4 py-2 w-full"
          />
        </div>

        <textarea
          placeholder="Notas"
          value={form.notas}
          onChange={(e) => setForm({ ...form, notas: e.target.value })}
          className="border rounded px-4 py-2 w-full mt-4"
        />

        <button
          onClick={salvarColeta}
          className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          {editId ? 'Atualizar' : 'Salvar'}
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-4">Coletas Registradas</h3>

      <div className="space-y-4">
        {coletas.map((coleta) => (
          <div key={coleta.id} className="border rounded p-4">
            <h4 className="text-lg font-semibold">{coleta.especie}</h4>
            <p className="text-gray-600">
              {coleta.local} — {coleta.data} às {coleta.hora}
            </p>
            {coleta.notas && <p className="italic text-gray-500 mt-1">{coleta.notas}</p>}

            <div className="flex gap-2 mt-3">
              <Link to={`/coleta/${projetoId}/amostras/${coleta.id}`}>
                <button className="border px-3 py-1 rounded hover:bg-gray-100">
                  Ver Amostras
                </button>
              </Link>
              <button
                onClick={() => editar(coleta)}
                className="border px-3 py-1 rounded hover:bg-gray-100"
              >
                Editar
              </button>
              <button
                onClick={() => excluir(coleta.id)}
                className="border px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Coleta;*/

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

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

  // 🔥 Carregar mock inicialmente
  const carregarColetas = () => {
    const mock = [
      {
        id: 1,
        especie: 'Mariposa Azul',
        local: 'FLONA Santarém',
        data: '2024-06-10',
        hora: '18:30',
        notas: 'Coletada próxima a uma árvore caída.',
      },
      {
        id: 2,
        especie: 'Mariposa Branca',
        local: 'Reserva XYZ',
        data: '2024-06-12',
        hora: '20:00',
        notas: 'Voo baixo, observada perto de um riacho.',
      },
    ];

    setColetas(mock);
  };

  const salvarColeta = () => {
    if (!form.especie || !form.local || !form.data || !form.hora) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    if (editId) {
      setColetas((prev) =>
        prev.map((item) =>
          item.id === editId ? { ...item, ...form } : item
        )
      );
      setEditId(null);
    } else {
      const novoId = coletas.length > 0 ? Math.max(...coletas.map((c) => c.id)) + 1 : 1;
      const novaColeta = { id: novoId, ...form };
      setColetas((prev) => [...prev, novaColeta]);
    }

    setForm({
      especie: '',
      local: '',
      data: '',
      hora: '',
      notas: '',
    });
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

  const excluir = (id) => {
    if (window.confirm('Deseja realmente excluir essa coleta?')) {
      setColetas((prev) => prev.filter((c) => c.id !== id));
    }
  };

  useEffect(() => {
    carregarColetas();
  }, [projetoId]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{editId ? 'Editar Coleta' : 'Nova Coleta'}</h2>

      <div className="bg-white rounded shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Espécie *"
            value={form.especie}
            onChange={(e) => setForm({ ...form, especie: e.target.value })}
            className="border rounded px-4 py-2 w-full"
          />

          <input
            placeholder="Local *"
            value={form.local}
            onChange={(e) => setForm({ ...form, local: e.target.value })}
            className="border rounded px-4 py-2 w-full"
          />

          <input
            type="date"
            value={form.data}
            onChange={(e) => setForm({ ...form, data: e.target.value })}
            className="border rounded px-4 py-2 w-full"
          />

          <input
            type="time"
            value={form.hora}
            onChange={(e) => setForm({ ...form, hora: e.target.value })}
            className="border rounded px-4 py-2 w-full"
          />
        </div>

        <textarea
          placeholder="Notas"
          value={form.notas}
          onChange={(e) => setForm({ ...form, notas: e.target.value })}
          className="border rounded px-4 py-2 w-full mt-4"
        />

        <button
          onClick={salvarColeta}
          className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          {editId ? 'Atualizar' : 'Salvar'}
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-4">Amostras Registradas</h3>

      <div className="space-y-4">
        {coletas.map((coleta) => (
          <div key={coleta.id} className="border rounded p-4">
            <h4 className="text-lg font-semibold">{coleta.especie}</h4>
            <p className="text-gray-600">
              {coleta.local} — {coleta.data} às {coleta.hora}
            </p>
            {coleta.notas && <p className="italic text-gray-500 mt-1">{coleta.notas}</p>}

            <div className="flex gap-2 mt-3">
              <Link to={`/projetos/id/coletas/coletaId/amostras/amostraId`}>
                <button className="border px-3 py-1 rounded hover:bg-gray-100">
                  Ver Amostras
                </button>
              </Link>
              <button
                onClick={() => editar(coleta)}
                className="border px-3 py-1 rounded hover:bg-gray-100"
              >
                Editar
              </button>
              <button
                onClick={() => excluir(coleta.id)}
                className="border px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Coleta;

