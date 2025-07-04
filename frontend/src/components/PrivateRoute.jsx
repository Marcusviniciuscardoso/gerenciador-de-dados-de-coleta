import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { obterUsuarioLogado } from "../services/usuarioService";

function PrivateRoute() {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const verificarLogin = async () => {
      try {
        await obterUsuarioLogado();
        setIsAuth(true);
      } catch (error) {
        console.log("Usuário não autenticado", error);
        setIsAuth(false);
      }
    };

    verificarLogin();
  }, []);

  if (isAuth === null) {
    return <p>Carregando...</p>;
  }

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
