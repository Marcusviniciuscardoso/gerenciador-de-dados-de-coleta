import React, { useEffect, useState } from 'react';
import { db } from './db/database';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Home() {
  const [nomePasta, setNomePasta] = useState('');
  const [pastas, setPastas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [novoNome, setNovoNome] = useState('');
  const navigate = useNavigate();

  const carregarPastas = async () => {
    const resultado = await db.pastas.toArray();
    setPastas(resultado);
  };

  const criarPasta = async () => {
    const nomeLimpo = nomePasta.trim();
    if (!nomeLimpo) {
      alert("Digite um nome para a pasta.");
      return;
    }

    const id = await db.pastas.add({ nome: nomeLimpo });
    setNomePasta('');
    await carregarPastas();
    navigate(`/coleta/${id}`);
  };

  const acessarPasta = (id) => {
    navigate(`/coleta/${id}`);
  };

  const iniciarEdicao = (pasta) => {
    setEditandoId(pasta.id);
    setNovoNome(pasta.nome);
  };

  const salvarEdicao = async (id) => {
    const nomeLimpo = novoNome.trim();
    if (!nomeLimpo) {
      alert("O nome não pode estar vazio.");
      return;
    }
    await db.pastas.update(id, { nome: nomeLimpo });
    setEditandoId(null);
    setNovoNome('');
    carregarPastas();
  };

  const excluirPasta = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta pasta? Isso não removerá as coletas, mas você pode querer organizar isso.")) {
      await db.pastas.delete(id);
      // Opcional: também remover coletas associadas
      // await db.coletas.where('pastaId').equals(id).delete();
      carregarPastas();
    }
  };

  useEffect(() => {
    carregarPastas();
  }, []);

  return (
    <div className="container">
      <h2>Gerenciar Projetos de Coleta</h2>

      <input
        placeholder="Nome da nova pasta"
        value={nomePasta}
        onChange={(e) => setNomePasta(e.target.value)}
      />
      <br />
      <button onClick={criarPasta}>Criar e Acessar</button>

      <h3>Pastas existentes</h3>
      <ul>
        {pastas.map((pasta) => (
          <li key={pasta.id}>
            {editandoId === pasta.id ? (
              <>
                <input
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                />
                <button onClick={() => salvarEdicao(pasta.id)}>Salvar</button>
                <button onClick={() => setEditandoId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                <strong>{pasta.nome}</strong><br />
                <button onClick={() => acessarPasta(pasta.id)}>Acessar</button>
                <button onClick={() => iniciarEdicao(pasta)}>Editar</button>
                <button
                  onClick={() => excluirPasta(pasta.id)}
                  style={{ backgroundColor: '#e74c3c', color: 'white', marginLeft: '5px' }}
                >
                  Excluir
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
