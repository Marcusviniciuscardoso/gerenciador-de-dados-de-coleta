import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Usuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });

  const fetchUsuarios = async () => {
    const res = await axios.get('http://localhost:3000/usuarios');
    setUsuarios(res.data);
  };

  const salvar = async () => {
    await axios.post('http://localhost:3000/usuarios', form);
    setForm({ nome: '', email: '', senha: '' });
    fetchUsuarios();
  };

  const excluir = async (id) => {
    await axios.delete(`http://localhost:3000/usuarios/${id}`);
    fetchUsuarios();
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div className="container">
      <h2>Usuários</h2>

      <input placeholder="Nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
      <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Senha" value={form.senha} onChange={e => setForm({ ...form, senha: e.target.value })} />
      <br />
      <button onClick={salvar}>Salvar Usuário</button>

      <ul>
        {usuarios.map(u => (
          <li key={u.id}>
            <strong>{u.nome}</strong> - {u.email}
            <br />
            <button onClick={() => excluir(u.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Usuario;