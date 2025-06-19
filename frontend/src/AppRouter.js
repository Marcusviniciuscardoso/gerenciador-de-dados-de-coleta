import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home';
import App from './App';
import Registro from './Registro';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coleta/:pastaId" element={<App />} />
        <Route path="/coleta/:pastaId/registro/:coletaId" element={<Registro />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
