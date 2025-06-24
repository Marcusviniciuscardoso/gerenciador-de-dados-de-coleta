import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);
  const [erro, setErro] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const response = await axios.post('http://localhost:3000/login', {
        email,
        senha,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);

      navigate('/home');
    } catch (error) {
      setErro('Email ou senha incorretos.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <div style={styles.logoArea}>
          <div style={styles.logo}>🧪</div>
          <h2>Sistema de Coleta Científica</h2>
          <p>Faça login para acessar sua conta</p>
        </div>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <label>Senha</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={styles.input}
          />

          <div style={styles.options}>
            <label>
              <input
                type="checkbox"
                checked={lembrar}
                onChange={() => setLembrar(!lembrar)}
              />
              Lembrar de mim
            </label>
            <Link to="#" style={styles.link}>
              Esqueceu a senha?
            </Link>
          </div>

          {erro && <p style={styles.error}>{erro}</p>}

          <button type="submit" style={styles.button}>
            Entrar
          </button>

          <p className='mt-4'>
            Não tem uma conta?{' '}
            <Link to="/cadastro" style={styles.cadastroLink}>
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;

// 🎨 Estilos Inline
const styles = {
  container: {
    backgroundColor: '#f6fbf9',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    background: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 0 15px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  logoArea: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  logo: {
    background: '#2ecc71',
    color: 'white',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    marginBottom: '15px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  options: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    fontSize: '14px',
  },
  link: {
    color: '#27ae60',
    textDecoration: 'none',
  },
  button: {
    backgroundColor: '#000',
    color: 'white',
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    margin: '20px 0',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
    fontSize: '14px',
  },
  cadastroLink: {
    color: '#27ae60',
    textDecoration: 'none',
  },
};
