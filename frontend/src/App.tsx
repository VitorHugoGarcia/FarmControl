import { HashRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/homePage";
import Layout from "./components/Layout";
import CadastroManualPage from "./pages/cadastroManualPage";
import CadastroUsuarioPage from "./pages/cadastroUsuarioPage";
import ListarUsuariosPage from "./pages/listarUsuariosPage";
import EditarUsuarioPage from "./pages/editarUsuarioPage";
import VendaPage from "./pages/VendaPage";
import RelatoriosPage from "./pages/RelatoriosPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/homePage" element={<HomePage />}/>
          <Route path="/cadastro-usuario" element={<CadastroUsuarioPage />} />
          <Route path="/cadastro-manual" element={<CadastroManualPage />}/>
          <Route path="/usuarios" element={<ListarUsuariosPage />} />
          <Route path="/editar-usuario" element={<EditarUsuarioPage />} />
          <Route path="/compra" element={<VendaPage />}/>
          <Route path="/relatorios" element={<RelatoriosPage />}/>
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
