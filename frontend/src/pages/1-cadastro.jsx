import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cadastrarUsuarioCompleto } from '../services/autenticacaoService';
import * as Yup from 'yup';
import { PageBadge } from '../components/layout/PageShell';
import { ButterflyIcon, FernIcon, LeafIcon, Logo } from '../components/decor/Illustrations';

const schema = Yup.object().shape({
  nome: Yup.string().required('Nome é obrigatório').min(3, 'Nome deve ter no mínimo 3 caracteres'),
  telefone: Yup.string().matches(/^\d{8,15}$/, 'Telefone inválido').nullable(),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  instituicao: Yup.string().required('Instituição é obrigatória'),
  biografia: Yup.string().max(255, 'Biografia muito longa').nullable(),
  senha: Yup.string().required('Senha é obrigatória').min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmarSenha: Yup.string().oneOf([Yup.ref('senha')], 'As senhas não coincidem').required('Confirmação da senha é obrigatória'),
  termos: Yup.boolean().oneOf([true], 'Você deve aceitar os termos de uso.'),
});

const CadastroUsuario = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '', telefone: '', email: '', instituicao: '', biografia: '',
    senha: '', confirmarSenha: '', termos: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await schema.validate(form, { abortEarly: false });
      await cadastrarUsuarioCompleto({
        nome: form.nome, telefone: form.telefone, instituicao: form.instituicao,
        biografia: form.biografia, email: form.email, senha: form.senha,
      });
      alert('Usuário criado com sucesso!');
      navigate('/login');
    } catch (err) {
      if (err.name === 'ValidationError') {
        alert(err.errors.join('\n'));
      } else {
        const msg = err.response?.data?.error || err.message;
        alert(`Erro ao criar usuário: ${msg}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-notebook py-10 px-6">
      <PageBadge number="02" label="Cadastro" />

      <div className="max-w-3xl mx-auto">
        {/* cabeçalho com ilustrações */}
        <div className="text-center relative mb-6">
          <div className="absolute left-0 top-4 hidden md:block"><LeafIcon size={48} /></div>
          <div className="absolute right-0 top-2 hidden md:block"><FernIcon size={40} /></div>

          <div className="inline-flex flex-col items-center">
            <Logo size={56} />
            <p className="font-script text-sage-600 text-lg mt-2">nova entrada no caderno</p>
            <h1 className="heading-serif text-4xl">Cadastrar pesquisador</h1>
            <p className="text-olive-light/80 mt-1">Preencha seus dados para iniciar suas coletas</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card-notebook space-y-5">
          <div>
            <label className="label-notebook">Nome completo</label>
            <input name="nome" type="text" placeholder="Maria Sibylla" value={form.nome} onChange={handleChange} required className="input-notebook" />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="label-notebook">Email</label>
              <input name="email" type="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} required className="input-notebook" />
            </div>
            <div>
              <label className="label-notebook">Telefone</label>
              <input name="telefone" type="text" placeholder="(11) 9..." value={form.telefone} onChange={handleChange} className="input-notebook" />
            </div>
          </div>

          <div>
            <label className="label-notebook">Instituição</label>
            <input name="instituicao" type="text" placeholder="Universidade / Lab" value={form.instituicao} onChange={handleChange} required className="input-notebook" />
          </div>

          <div>
            <label className="label-notebook">Biografia / função</label>
            <input name="biografia" type="text" placeholder="Ex: Doutoranda em Entomologia" value={form.biografia} onChange={handleChange} className="input-notebook" />
            <p className="font-script text-sage-600 text-sm mt-1">opcional — uma linha sobre você</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="label-notebook">Senha</label>
              <input name="senha" type="password" placeholder="mínimo 6 caracteres" value={form.senha} onChange={handleChange} required className="input-notebook" />
            </div>
            <div>
              <label className="label-notebook">Confirmar senha</label>
              <input name="confirmarSenha" type="password" placeholder="repita a senha" value={form.confirmarSenha} onChange={handleChange} required className="input-notebook" />
            </div>
          </div>

          <label className="flex items-start gap-2 text-sm text-olive">
            <input type="checkbox" name="termos" checked={form.termos} onChange={handleChange} className="mt-1 w-4 h-4 accent-olive" />
            <span>
              Aceito os <a href="#" className="text-olive font-semibold underline">termos de uso</a> e{' '}
              <a href="#" className="text-olive font-semibold underline">política de privacidade</a>.
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">Criar conta</button>
            <Link to="/login" className="btn-secondary flex-1 justify-center">Já tenho conta</Link>
          </div>
        </form>

        <p className="text-center font-script text-sage-600 mt-6 flex items-center justify-center gap-2">
          <span>✦</span> seus dados ficam guardados como um espécime no herbário <span>✦</span>
        </p>
      </div>
    </div>
  );
};

export default CadastroUsuario;
