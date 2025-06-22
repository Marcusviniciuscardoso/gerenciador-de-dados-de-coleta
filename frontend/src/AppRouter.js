import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Projeto from './pages/2-projeto';
import Coleta from './pages/4-coleta';
import Amostras from './pages/Amostras';
import Imagens from './pages/Imagens';
import Login from './pages/Login';
import CadastroUsuario from './pages/CadastroUsuario';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projeto/:id" element={<Projeto />} />
        <Route path="/coleta/:id" element={<Coleta />} />
        <Route path="/amostras/:id" element={<Amostras />} />
        <Route path="/imagens/:id" element={<Imagens />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<CadastroUsuario />} />
      </Routes>
    </Router>
  );
}

export default App;
