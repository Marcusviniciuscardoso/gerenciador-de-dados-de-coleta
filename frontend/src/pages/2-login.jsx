import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/credencialService';
import * as Yup from 'yup';
import { PageBadge } from '../components/layout/PageShell';
import { ButterflyIcon, MothIcon, FernIcon, FlowerIcon, LeafIcon, Logo } from '../components/decor/Illustrations';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);
  const [erro, setErro] = useState('');

  const schema = Yup.object().shape({
    email: Yup.string().email('Digite um email válido').required('O campo email é obrigatório'),
    senha: Yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres').required('O campo senha é obrigatório'),
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      await schema.validate({ email, senha }, { abortEarly: false });
      const response = await login({ email, senha });
      const { token } = response.data;
      localStorage.setItem('token', token);
      navigate('/projetos');
    } catch (error) {
      console.error(error);
      setErro('Email ou senha incorretos.');
    }
  };

  return (
    <div className="min-h-screen bg-notebook flex items-center justify-center p-6">
      <PageBadge number="01" label="Login" />

      <div className="w-full max-w-5xl bg-paper-light rounded-2xl shadow-notebook overflow-hidden grid md:grid-cols-2 border border-tan/60">
        {/* Painel esquerdo — sage */}
        <div className="bg-sage-200 p-10 flex flex-col justify-between relative min-h-[520px]">
          <div className="flex items-center gap-3">
            <Logo size={44} />
            <div className="leading-tight">
              <div className="font-serif text-xl text-olive-dark font-semibold">Lepidoptera</div>
              <div className="font-script text-sage-600 text-sm -mt-1">caderno de campo</div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center relative">
            <div className="absolute left-4 top-4"><ButterflyIcon size={90} /></div>
            <div className="absolute right-4 top-20"><MothIcon size={70} /></div>
            <div className="absolute left-2 bottom-12"><FernIcon size={32} /></div>
            <div className="absolute left-20 bottom-16"><LeafIcon size={28} /></div>
            <div className="absolute right-16 bottom-8"><FlowerIcon size={36} /></div>
          </div>

          <blockquote className="font-script text-olive-light text-xl leading-snug max-w-xs">
            "Cada espécime é uma página do livro da natureza."
            <footer className="mt-2 text-xs tracking-widest uppercase text-sage-600 font-sans not-italic">
              — Maria Sibylla Merian, 1705
            </footer>
          </blockquote>
        </div>

        {/* Painel direito — formulário */}
        <div className="p-10 md:p-12">
          <p className="font-script text-sage-600 text-lg">bem-vindo de volta</p>
          <h1 className="heading-serif text-4xl mb-8 leading-tight">
            Acesse seu<br />caderno de coleta
          </h1>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="label-notebook">Email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-notebook"
              />
            </div>

            <div>
              <label className="label-notebook">Senha</label>
              <input
                type="password"
                placeholder="••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="input-notebook"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-olive">
                <input
                  type="checkbox"
                  checked={lembrar}
                  onChange={() => setLembrar(!lembrar)}
                  className="w-4 h-4 accent-olive"
                />
                Lembrar de mim
              </label>
              <Link to="#" className="font-script text-sage-600 hover:text-olive">Esqueceu a senha?</Link>
            </div>

            {erro && <p className="text-rust text-sm">{erro}</p>}

            <button type="submit" className="btn-primary w-full">Entrar no caderno</button>

            <div className="divider-decorative pt-2"><span className="text-tan-dark">·</span></div>

            <p className="text-center text-sm text-olive-light">
              Ainda não tem conta?{' '}
              <Link to="/cadastro" className="font-semibold text-olive underline underline-offset-2 hover:text-olive-dark">
                Cadastre-se
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
