import React, { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { criarAmostra, atualizarAmostra } from '../services/amostraService';
import { presignUpload } from '../services/uploadService';
import PageShell, { PageHeader, SectionHeading } from '../components/layout/PageShell';
import { ButterflyIcon } from '../components/decor/Illustrations';

function NovaAmostra() {
  const { id, coletaId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    descricao: '', codigo: '', tipoAmostra: '', recipiente: '', metodoPreservacao: '',
    quantidade: '', validade: '', identificacao_final: '', observacoes: '',
    imagens: [], imageLink: '',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleImagem = (e) => {
    const files = Array.from(e.target.files || []);
    setForm((prev) => ({ ...prev, imagens: files }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImagens = async (amostraId) => {
    if (!form.imagens.length) return [];
    setUploading(true);
    setUploadError('');
    const keys = [];
    try {
      for (const file of form.imagens) {
        const { data } = await presignUpload({ filename: file.name, contentType: file.type, amostraId });
        const { uploadUrl, key } = data;
        const resp = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
        if (!resp.ok) throw new Error(`Falha no PUT do arquivo ${file.name}: ${resp.status}`);
        keys.push(key);
      }
      return keys;
    } catch (err) {
      console.error('Erro no upload das imagens:', err);
      setUploadError('Erro ao enviar as imagens.');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const salvarAmostra = async (e) => {
    e?.preventDefault();
    try {
      const payload = { ...form, imagens: undefined, imageLink: undefined, coletaId };
      const response = await criarAmostra(payload);
      const amostraCriada = response.data || response;
      const amostraId = amostraCriada.idAmostras || amostraCriada.id;
      if (amostraId && form.imagens.length) {
        const keys = await uploadImagens(amostraId);
        if (keys.length > 0) await atualizarAmostra(amostraId, { imageLink: keys[0] });
      }
      alert('Amostra registrada com sucesso!');
      navigate(`/projetos/${id}/coletas/${coletaId}`);
    } catch (error) {
      console.error('Erro ao salvar amostra:', error);
      alert('Erro ao salvar amostra');
    }
  };

  return (
    <PageShell badge={{ number: '09', label: 'Nova Amostra' }}>
      <PageHeader
        overline="novo espécime"
        title="Registrar amostra"
        subtitle={`Coleta nº ${coletaId}`}
        onBack={() => navigate(-1)}
      />

      <form onSubmit={salvarAmostra} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-notebook space-y-4">
            <SectionHeading overline="quem é" title="Identificação" />

            <div>
              <label className="label-notebook">Código *</label>
              <input name="codigo" placeholder="Ex: MAR-2025-010" value={form.codigo} onChange={handleChange} required className="input-notebook" />
            </div>
            <div>
              <label className="label-notebook">Descrição *</label>
              <textarea name="descricao" rows={3} placeholder="Padrão das asas, cor, tamanho aproximado..." value={form.descricao} onChange={handleChange} required className="input-notebook" />
            </div>
            <div>
              <label className="label-notebook">Tipo de amostra</label>
              <input name="tipoAmostra" placeholder="Ex: Adulto, Larva, Pupa" value={form.tipoAmostra} onChange={handleChange} className="input-notebook" />
            </div>
            <div>
              <label className="label-notebook">Identificação final</label>
              <input name="identificacao_final" placeholder="Gênero/espécie quando confirmada" value={form.identificacao_final} onChange={handleChange} className="input-notebook" />
              <p className="font-script text-sage-600 text-sm mt-1">pode ser preenchida depois</p>
            </div>
          </div>

          <div className="card-notebook space-y-4">
            <SectionHeading overline="conservação" title="Armazenamento" />

            <div>
              <label className="label-notebook">Recipiente *</label>
              <input name="recipiente" placeholder="Envelope, frasco, caixa..." value={form.recipiente} onChange={handleChange} required className="input-notebook" />
            </div>
            <div>
              <label className="label-notebook">Método de preservação *</label>
              <input name="metodoPreservacao" placeholder="Álcool 70%, alfinetada..." value={form.metodoPreservacao} onChange={handleChange} required className="input-notebook" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-notebook">Quantidade *</label>
                <input name="quantidade" placeholder="Ex: 1 indivíduo" value={form.quantidade} onChange={handleChange} required className="input-notebook" />
              </div>
              <div>
                <label className="label-notebook">Validade</label>
                <input type="date" name="validade" value={form.validade} onChange={handleChange} className="input-notebook" />
              </div>
            </div>
            <div>
              <label className="label-notebook">Observações</label>
              <textarea name="observacoes" rows={3} placeholder="Comportamento, planta hospedeira..." value={form.observacoes} onChange={handleChange} className="input-notebook" />
            </div>
          </div>
        </div>

        <div className="card-notebook">
          <SectionHeading overline="fotografia" title="Documentação fotográfica" className="mb-5" />

          <div
            className="border-2 border-dashed border-tan rounded-lg p-10 text-center cursor-pointer hover:bg-paper transition"
            onClick={() => fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImagem} className="hidden" />
            <div className="flex justify-center mb-3"><ButterflyIcon size={50} /></div>
            <p className="heading-serif text-lg">Clique ou arraste imagens aqui</p>
            <p className="font-script text-sage-600 text-base mt-1">registre o espécime de vários ângulos</p>
            <p className="text-xs text-tan-dark tracking-widest uppercase mt-3">PNG ou JPG · até 10 imagens</p>
          </div>

          {form.imagens.length > 0 && (
            <ul className="mt-4 text-sm text-olive list-disc list-inside">
              {form.imagens.map((file, i) => <li key={i}>{file.name}</li>)}
            </ul>
          )}
          {uploading && <p className="text-sm text-sage-600 mt-3">Enviando imagens, aguarde...</p>}
          {uploadError && <p className="text-sm text-rust mt-3">{uploadError}</p>}
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancelar</button>
          <button type="submit" disabled={uploading} className="btn-primary">
            {uploading ? 'Salvando...' : 'Registrar amostra'}
          </button>
        </div>
      </form>
    </PageShell>
  );
}

export default NovaAmostra;
