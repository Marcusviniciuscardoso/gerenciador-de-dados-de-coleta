import React, { useEffect, useState } from 'react';
import { db } from './db/database';
import './App.css';
import { useParams, Link, useNavigate } from 'react-router-dom'; // adicionado useNavigate

function App() {
  const { pastaId } = useParams();
  const navigate = useNavigate(); // necessário para redirecionamento
  const [coletas, setColetas] = useState([]);
  const [novaColeta, setNovaColeta] = useState({
    especie: '',
    local: '',
    data: '',
    hora: '',
    notas: '',
    registrado_por: '',
    imagem: ''
  });
  const [idEmEdicao, setIdEmEdicao] = useState(null);

  const atualizarLista = async () => {
    const id = Number(pastaId);
    if (!id || isNaN(id)) {
      navigate('/'); // redireciona se o id da pasta for inválido
      return;
    }

    const dados = await db.coletas
      .where('pastaId')
      .equals(id)
      .toArray();

    setColetas(dados);
  };

  const salvarColeta = async () => {
    const camposObrigatorios = ['especie', 'local', 'data', 'hora', 'registrado_por'];
    const camposVazios = camposObrigatorios.filter(campo => !novaColeta[campo]?.trim());

    if (camposVazios.length > 0) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const id = Number(pastaId);
    if (isNaN(id)) {
      alert("ID da pasta inválido.");
      return;
    }

    if (idEmEdicao) {
      await db.coletas.update(idEmEdicao, novaColeta);
      setIdEmEdicao(null);
    } else {
      await db.coletas.add({ ...novaColeta, pastaId: id });
    }

    setNovaColeta({
      especie: '',
      local: '',
      data: '',
      hora: '',
      notas: '',
      registrado_por: '',
      imagem: ''
    });

    atualizarLista();
  };

  const editarColeta = (coleta) => {
    setNovaColeta(coleta);
    setIdEmEdicao(coleta.id);
  };

  const excluirColeta = async (id) => {
    await db.coletas.delete(id);
    atualizarLista();
  };

  const handleImagem = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNovaColeta(prev => ({ ...prev, imagem: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    atualizarLista();
  }, [pastaId]);

  return (
    <div className="container">
      <h2>{idEmEdicao ? 'Editar Coleta' : 'Nova Coleta'}</h2>

      <input placeholder="Espécie *" value={novaColeta.especie} onChange={e => setNovaColeta({ ...novaColeta, especie: e.target.value })} /><br />
      <input placeholder="Local *" value={novaColeta.local} onChange={e => setNovaColeta({ ...novaColeta, local: e.target.value })} /><br />
      <input type="date" value={novaColeta.data} onChange={e => setNovaColeta({ ...novaColeta, data: e.target.value })} /><br />
      <input type="time" value={novaColeta.hora} onChange={e => setNovaColeta({ ...novaColeta, hora: e.target.value })} /><br />
      <textarea placeholder="Notas" value={novaColeta.notas} onChange={e => setNovaColeta({ ...novaColeta, notas: e.target.value })} /><br />
      <input placeholder="Registrado por *" value={novaColeta.registrado_por} onChange={e => setNovaColeta({ ...novaColeta, registrado_por: e.target.value })} /><br />
      <input type="file" accept="image/*" onChange={handleImagem} /><br />

      <button onClick={salvarColeta}>
        {idEmEdicao ? "Atualizar Coleta" : "Salvar Coleta"}
      </button>

      <h2>Coletas Salvas</h2>
      <ul>
        {coletas.map(coleta => (
          <li key={coleta.id}>
            <strong>{coleta.especie}</strong> - {coleta.local} - {coleta.data} {coleta.hora} <br />
            <em>{coleta.notas}</em> — por {coleta.registrado_por}
            <br />
            {coleta.imagem && (
              <img
                src={coleta.imagem}
                alt="Foto da coleta"
                style={{ maxWidth: '100%', marginTop: '10px', borderRadius: '6px' }}
              />
            )}
            <br />
            <Link to={`/coleta/${pastaId}/registro/${coleta.id}`}>
              <button style={{ marginRight: '10px' }}>Visualizar</button>
            </Link>
            <button onClick={() => editarColeta(coleta)} style={{ marginRight: '10px' }}>
              Editar
            </button>
            <button onClick={() => excluirColeta(coleta.id)} style={{ backgroundColor: '#e74c3c', color: '#fff' }}>
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
