import React, { useEffect, useState } from 'react';
import { Mail, Phone, School, Briefcase, Pencil } from 'lucide-react';
import { getCredencialById } from '../services/credencialService';
import { obterUsuarioLogado, atualizarUsuario } from '../services/usuarioService';
import PageShell, { PageHeader, SectionHeading } from '../components/layout/PageShell';
import { ButterflyIcon, LeafIcon, FernIcon } from '../components/decor/Illustrations';

function getInitials(nome) {
  if (!nome) return 'MS';
  const parts = nome.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || 'MS';
}

function Usuario() {
  const [usuario, setUsuario] = useState({});
  const [credencial, setCredencial] = useState({});
  const [modoEdicao, setModoEdicao] = useState(false);

  useEffect(() => {
    const buscar = async () => {
      try {
        const usuarioResponse = await obterUsuarioLogado();
        setUsuario(usuarioResponse.data);
        if (usuarioResponse.data?.idUsuarios) {
          const credencialResponse = await getCredencialById(usuarioResponse.data.idUsuarios);
          setCredencial(credencialResponse.data);
        }
      } catch (error) {
        console.error('Erro ao buscar usuário ou credencial:', error);
      }
    };
    buscar();
  }, []);

  const handleChange = (e) => setUsuario({ ...usuario, [e.target.name]: e.target.value });

  const salvarEdicao = async () => {
    try {
      await atualizarUsuario(usuario.idUsuarios, usuario);
      alert('Perfil atualizado com sucesso!');
      setModoEdicao(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar o perfil.');
    }
  };

  const initials = getInitials(usuario.nome);
  const ano = usuario.data_cadastro ? new Date(usuario.data_cadastro).getFullYear() : new Date().getFullYear();

  return (
    <PageShell badge={{ number: '10', label: 'Perfil' }}>
      <PageHeader
        overline="seus dados"
        title="Meu perfil"
        actions={
          modoEdicao ? (
            <>
              <button onClick={() => setModoEdicao(false)} className="btn-secondary">Cancelar</button>
              <button onClick={salvarEdicao} className="btn-primary">Salvar</button>
            </>
          ) : (
            <button onClick={() => setModoEdicao(true)} className="btn-secondary"><Pencil className="w-4 h-4" /> Editar perfil</button>
          )
        }
      />

      <div className="grid md:grid-cols-3 gap-6">
        {/* Card identidade */}
        <div className="card-notebook relative">
          <FernIcon size={32} className="absolute top-4 right-4 opacity-40" />
          <LeafIcon size={28} className="absolute bottom-4 left-4 opacity-40" />

          <div className="flex flex-col items-center text-center pt-4">
            <div className="w-32 h-32 rounded-full border-4 border-sage-200 bg-paper flex items-center justify-center relative">
              <ButterflyIcon size={80} />
              <div className="absolute -bottom-1 bg-paper-light border border-tan px-3 py-0.5 rounded-full font-script text-sage-600 text-sm">
                {initials} · {ano}
              </div>
            </div>

            <h2 className="heading-serif text-2xl mt-6">
              {modoEdicao ? (
                <input name="nome" value={usuario.nome || ''} onChange={handleChange} className="input-notebook text-center" />
              ) : (
                usuario.nome || '—'
              )}
            </h2>
            <p className="font-script text-sage-600 text-lg italic">
              {modoEdicao ? (
                <input name="biografia" value={usuario.biografia || ''} onChange={handleChange} className="input-notebook text-center mt-2" />
              ) : (
                usuario.biografia || usuario.cargo || '—'
              )}
            </p>
            <div className="mt-4 text-[11px] tracking-widest uppercase text-olive-light/70">
              Membro desde {usuario.data_cadastro || '—'}
            </div>
          </div>
        </div>

        {/* Card informações */}
        <div className="md:col-span-2 card-notebook">
          <SectionHeading overline="informações" title="Contato & instituição" className="mb-6" />

          <div className="space-y-1">
            <InfoRow icon={Mail} label="Email" value={credencial.email} />
            <InfoRow
              icon={Phone}
              label="Telefone"
              value={modoEdicao ? (
                <input name="telefone" value={usuario.telefone || ''} onChange={handleChange} className="input-notebook" />
              ) : (usuario.telefone || '—')}
            />
            <InfoRow
              icon={School}
              label="Instituição"
              value={modoEdicao ? (
                <input name="instituicao" value={usuario.instituicao || ''} onChange={handleChange} className="input-notebook" />
              ) : (usuario.instituicao || '—')}
            />
            <InfoRow
              icon={Briefcase}
              label="Cargo"
              value={modoEdicao ? (
                <input name="cargo" value={usuario.cargo || ''} onChange={handleChange} className="input-notebook" />
              ) : (usuario.cargo || '—')}
            />
          </div>

          {/* Estatísticas tipo "post-it" */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <StatCard label="COLETAS" value={usuario.coletas ?? '—'} sub="espécimes catalogados" />
            <StatCard label="PROJETOS" value={usuario.projetos ?? '—'} sub="investigações ativas" />
            <StatCard label="ÚLTIMA SAÍDA" value={usuario.ultimaSaida ?? '—'} sub={usuario.ultimoLocal || ''} />
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-dashed border-tan last:border-b-0">
      <div className="w-9 h-9 rounded-full bg-sage-100 border border-tan flex items-center justify-center text-olive">
        <Icon size={16} />
      </div>
      <div className="text-[10px] tracking-widest font-semibold uppercase text-olive w-32">{label}</div>
      <div className="flex-1 text-olive-dark">{value || '—'}</div>
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-paper border border-tan rounded-md p-4 relative shadow-card">
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-3 w-12 bg-tan/40 rounded-sm"></div>
      <div className="text-[10px] tracking-widest font-semibold uppercase text-olive text-center">{label}</div>
      <div className="heading-serif text-2xl text-center mt-1">{value}</div>
      <div className="font-script text-sage-600 text-sm text-center">{sub}</div>
    </div>
  );
}

export default Usuario;
