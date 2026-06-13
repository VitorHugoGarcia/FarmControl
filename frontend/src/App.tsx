import { HashRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/loginPages";
import HomePage from "./pages/homePage";
import Layout from "./components/Layout";
import CadastroManualPage from "./pages/cadastroManualPage";
import CadastroUsuarioPage from "./pages/cadastroUsuarioPage";
import ListarUsuariosPage from "./pages/listarUsuariosPage";
import EditarUsuarioPage from "./pages/editarUsuarioPage";


function App() {
  return (
    <HashRouter>
      <Routes>
        { <Route path="/" element={<LoginPage />} /> }

        <Route element={<Layout />}>
          <Route path="/homePage" element={<HomePage />}/>
          <Route path="/cadastro-usuario" element={<CadastroUsuarioPage />} />
          <Route path="/cadastro-manual" element={<CadastroManualPage />}/>
          <Route path="/usuarios" element={<ListarUsuariosPage />} />
          <Route path="/editar-usuario" element={<EditarUsuarioPage />} />
        </Route> 
      </Routes>
    </HashRouter>
  );
}

export default App;