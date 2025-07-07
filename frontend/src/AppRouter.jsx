import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import CadastroUsuario from './pages/1-cadastro';
import Login from './pages/2-login';
import Usuario from './pages/3-usuario';
import Projeto from './pages/4-projeto';
import CriarProjeto from './pages/5-criarProjeto';
import ProjetoId from './pages/6-projetoId';
import CriarColeta from './pages/7-criarColeta';
import ColetaId from './pages/8-coletaId';
import CriarAmostra from './pages/9-criarAmostra';
import AmostrasId from './pages/010-amostrasId';
import PrivateRoute from './components/PrivateRoute';

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* ROTAS PÚBLICAS */}
        <Route path="/cadastro" element={<CadastroUsuario />} />
        <Route path="/login" element={<Login />} />

        {/* ROTAS PRIVADAS */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Projeto />} />
          <Route path="/usuario" element={<Usuario />} />

          <Route path="/projetos" element={<Projeto />} />
          <Route path="/projetos/novo" element={<CriarProjeto />} />
          <Route path="/projetos/:id" element={<ProjetoId />} />

          <Route path="/projetos/:id/coletas/novo" element={<CriarColeta />} />
          <Route path="/projetos/:id/coletas/:coletaId" element={<ColetaId />} />

          <Route path="/projetos/:id/coletas/:coletaId/amostras/novo" element={<CriarAmostra />} />
          <Route path="/projetos/:id/coletas/:coletaId/amostras/:amostraId" element={<AmostrasId />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;
