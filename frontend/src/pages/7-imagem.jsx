import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Imagem() {
  const [imagens, setImagens] = useState([]);
  const [form, setForm] = useState({ descricao: '', arquivo_base64: '', coletaId: '', amostraId: '' });

  const fetchImagens = async () => {
    const res = await axios.get('http://localhost:3000/imagens');
    setImagens(res.data);
  };

  const handleImagem = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, arquivo_base64: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const salvar = async () => {
    await axios.post('http://localhost:3000/imagens', form);
    setForm({ descricao: '', arquivo_base64: '', coletaId: '', amostraId: '' });
    fetchImagens();
  };

  const excluir = async (id) => {
    await axios.delete(`http://localhost:3000/imagens/${id}`);
    fetchImagens();
  };

  useEffect(() => {
    fetchImagens();
  }, []);

  return (
    <div className="container">
      <h2>Imagens</h2>

      <input placeholder="Descrição" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
      <input placeholder="ID da Coleta" value={form.coletaId} onChange={e => setForm({ ...form, coletaId: e.target.value })} />
      <input placeholder="ID da Amostra" value={form.amostraId} onChange={e => setForm({ ...form, amostraId: e.target.value })} />
      <input type="file" accept="image/*" onChange={handleImagem} />
      <br />
      <button onClick={salvar}>Salvar Imagem</button>

      <ul>
        {imagens.map(img => (
          <li key={img.id}>
            <strong>{img.descricao}</strong><br />
            {img.arquivo_base64 && <img src={img.arquivo_base64} alt="Imagem" style={{ width: '200px' }} />}
            <br />
            <button onClick={() => excluir(img.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Imagem;
