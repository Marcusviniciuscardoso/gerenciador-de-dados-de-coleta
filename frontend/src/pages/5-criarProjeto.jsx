import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obterUsuarioLogado } from '../services/usuarioService';
import { criarProjeto } from '../services/projetoService';
import PageShell, { PageHeader, SectionHeading } from '../components/layout/PageShell';
import { MothIcon } from '../components/decor/Illustrations';

function CriarProjeto() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: '', descricao: '', objetivos: '', metodologia: '', resultadosEsperados: '',
    palavrasChave: '', colaboradores: '', financiamento: '', orcamento: '',
    data_inicio: '', data_fim: '', imageLink: '',
  });

  useEffect(() => {
    const buscar = async () => {
      try {
        const resp = await obterUsuarioLogado();
        setUsuario(resp.data);
      } catch (err) {
        console.error('Erro ao buscar usuário logado', err);
        alert('Erro ao obter usuário logado.');
        navigate('/login');
      }
    };
    buscar();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario?.idUsuarios) {
      alert('Usuário não autenticado!');
      return;
    }
    setLoading(true);
    try {
      const projetoData = {
        ...Object.fromEntries(
          Object.entries(form).map(([key, value]) => (value === '' ? [key, null] : [key, value]))
        ),
        criado_por: usuario.idUsuarios,
      };
      await criarProjeto(projetoData);
      alert('Projeto criado com sucesso!');
      navigate('/projetos');
    } catch (error) {
      console.error('Erro ao criar projeto', error);
      alert(error.response?.data?.error || 'Erro ao criar projeto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell badge={{ number: '04', label: 'Novo Projeto' }}>
      <PageHeader
        overline="nova investigação"
        title="Cadastrar projeto"
        onBack={() => navigate(-1)}
        actions={
          <>
            <button type="button" onClick={() => navigate(-1)} disabled={loading} className="btn-secondary">Cancelar</button>
            <button type="submit" form="form-projeto" disabled={loading} className="btn-primary">
              {loading ? 'Salvando...' : 'Salvar projeto'}
            </button>
          </>
        }
      />

      <form id="form-projeto" onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        {/* Coluna principal */}
        <div className="lg:col-span-2 card-notebook space-y-5">
          <SectionHeading overline="dados gerais" title="Identificação" />

          <div>
            <label className="label-notebook">Nome do projeto *</label>
            <input type="text" name="nome" placeholder="Ex: Mariposas da Mata Atlântica" value={form.nome} onChange={handleInputChange} required className="input-notebook" />
          </div>
          <div>
            <label className="label-notebook">Descrição</label>
            <textarea name="descricao" rows={3} placeholder="Resumo curto do projeto..." value={form.descricao} onChange={handleInputChange} className="input-notebook" />
          </div>
          <div>
            <label className="label-notebook">Objetivos</label>
            <textarea name="objetivos" rows={3} placeholder="O que se pretende investigar?" value={form.objetivos} onChange={handleInputChange} className="input-notebook" />
          </div>
          <div>
            <label className="label-notebook">Metodologia</label>
            <textarea name="metodologia" rows={3} placeholder="Como serão feitas as coletas?" value={form.metodologia} onChange={handleInputChange} className="input-notebook" />
          </div>
          <div>
            <label className="label-notebook">Resultados esperados</label>
            <textarea name="resultadosEsperados" rows={2} value={form.resultadosEsperados} onChange={handleInputChange} className="input-notebook" />
          </div>
          <div>
            <label className="label-notebook">Palavras-chave</label>
            <input type="text" name="palavrasChave" placeholder="lepidoptera, mata atlântica, biodiversidade" value={form.palavrasChave} onChange={handleInputChange} className="input-notebook" />
            <p className="font-script text-sage-600 text-sm mt-1">separadas por vírgula</p>
          </div>
          <div>
            <label className="label-notebook">Link da imagem</label>
            <input type="text" name="imageLink" value={form.imageLink} onChange={handleInputChange} className="input-notebook" />
          </div>
        </div>

        {/* Coluna lateral */}
        <div className="space-y-6">
          <div className="card-notebook space-y-4">
            <SectionHeading overline="cronograma" title="Datas" />
            <div>
              <label className="label-notebook">Início *</label>
              <input type="date" name="data_inicio" value={form.data_inicio} onChange={handleInputChange} required className="input-notebook" />
            </div>
            <div>
              <label className="label-notebook">Fim previsto</label>
              <input type="date" name="data_fim" value={form.data_fim} onChange={handleInputChange} className="input-notebook" />
            </div>
          </div>

          <div className="card-notebook space-y-4">
            <SectionHeading overline="equipe" title="Colaboradores" />
            <div>
              <label className="label-notebook">Pesquisadores *</label>
              <input type="text" name="colaboradores" placeholder="Nomes separados por vírgula" value={form.colaboradores} onChange={handleInputChange} required className="input-notebook" />
            </div>
            <div>
              <label className="label-notebook">Financiamento</label>
              <input type="text" name="financiamento" placeholder="CNPq, FAPESP..." value={form.financiamento} onChange={handleInputChange} className="input-notebook" />
            </div>
            <div>
              <label className="label-notebook">Orçamento (R$)</label>
              <input type="number" name="orcamento" value={form.orcamento} onChange={handleInputChange} className="input-notebook" />
            </div>
          </div>

          <div className="bg-paper-light border-2 border-dashed border-tan rounded-lg p-5 relative">
            <MothIcon size={42} className="absolute top-3 right-3 opacity-60" />
            <p className="font-script text-sage-600 text-base leading-snug pr-12">
              dica: você poderá adicionar coletas e amostras a este projeto depois de criá-lo.
            </p>
          </div>
        </div>
      </form>
    </PageShell>
  );
}

export default CriarProjeto;
