import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { obterUsuarioLogado } from '../services/usuarioService';
import { getProjetoById } from '../services/projetoService';
import { criarColeta } from '../services/coletaService';
import PageShell, { PageHeader, SectionHeading } from '../components/layout/PageShell';
import { FernIcon } from '../components/decor/Illustrations';

function NovaColeta() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [projeto, setProjeto] = useState({});
  const [form, setForm] = useState({
    local: '', latitude: '', longitude: '', dataColeta: '',
    hora_inicio: '', hora_fim: '', observacoes: '',
  });

  useEffect(() => {
    const carregar = async () => {
      try {
        const usuarioResp = await obterUsuarioLogado();
        setUsuario(usuarioResp.data);
        const projetoResp = await getProjetoById(id);
        const projetoData = Array.isArray(projetoResp.data) ? projetoResp.data[0] : projetoResp.data;
        setProjeto(projetoData);
      } catch (err) {
        console.error(err);
        alert('Erro ao buscar dados.');
      }
    };
    carregar();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const salvarColeta = async (e) => {
    e?.preventDefault();
    try {
      const payload = {
        ...form,
        latitude: Number(parseFloat(form.latitude).toFixed(6)),
        longitude: Number(parseFloat(form.longitude).toFixed(6)),
        projetoId: id,
        coletado_por: usuario?.idUsuarios,
      };
      await criarColeta(payload);
      alert('Coleta registrada com sucesso!');
      navigate(`/projetos/${id}`);
    } catch (error) {
      console.error('Erro ao salvar coleta:', error);
      alert('Erro ao salvar coleta');
    }
  };

  return (
    <PageShell badge={{ number: '08', label: 'Nova Coleta' }}>
      <PageHeader
        overline="nova saída"
        title="Registrar coleta"
        subtitle={projeto.nome ? `Projeto: ${projeto.nome}` : 'Carregando...'}
        onBack={() => navigate(-1)}
      />

      <form onSubmit={salvarColeta} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-notebook space-y-5">
          <SectionHeading overline="local & tempo" title="Onde e quando" />

          <div>
            <label className="label-notebook">Local *</label>
            <input name="local" placeholder="Ex: PE Serra do Mar — Cunha/SP" value={form.local} onChange={handleChange} required className="input-notebook" />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="label-notebook">Data *</label>
              <input type="date" name="dataColeta" value={form.dataColeta} onChange={handleChange} required className="input-notebook" />
            </div>
            <div>
              <label className="label-notebook">Hora início *</label>
              <input type="time" name="hora_inicio" value={form.hora_inicio} onChange={handleChange} required className="input-notebook" />
            </div>
            <div>
              <label className="label-notebook">Hora fim *</label>
              <input type="time" name="hora_fim" value={form.hora_fim} onChange={handleChange} required className="input-notebook" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label-notebook">Latitude *</label>
              <input type="number" name="latitude" step="0.000001" placeholder="-23.0712" value={form.latitude} onChange={handleChange} required className="input-notebook" />
            </div>
            <div>
              <label className="label-notebook">Longitude *</label>
              <input type="number" name="longitude" step="0.000001" placeholder="-44.9354" value={form.longitude} onChange={handleChange} required className="input-notebook" />
            </div>
          </div>

          <div>
            <label className="label-notebook">Observações</label>
            <textarea name="observacoes" rows={3} placeholder="Condições climáticas, método empregado, particularidades..." value={form.observacoes} onChange={handleChange} className="input-notebook" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-notebook relative">
            <FernIcon size={28} className="absolute top-3 right-3 opacity-50" />
            <SectionHeading overline="dica" title="Boas práticas" />
            <ul className="mt-4 space-y-2 text-sm text-olive-light/90">
              <li className="flex gap-2"><span className="text-sage-600">·</span> Use coordenadas em graus decimais (WGS84).</li>
              <li className="flex gap-2"><span className="text-sage-600">·</span> Registre a hora local de início e fim da atividade.</li>
              <li className="flex gap-2"><span className="text-sage-600">·</span> Anote condições do tempo nas observações.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <button type="submit" className="btn-primary">Salvar coleta</button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancelar</button>
          </div>
        </div>
      </form>
    </PageShell>
  );
}

export default NovaColeta;
