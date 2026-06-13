import { HashRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/homePage";
import Layout from "./components/Layout";
import CadastroManualPage from "./pages/cadastroManualPage";
import VendaPage from "./pages/VendaPage";
import RelatoriosPage from "./pages/RelatoriosPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />}/>
          <Route path="/cadastro-manual" element={<CadastroManualPage />}/>
          <Route path="/compra" element={<VendaPage />}/>
          <Route path="/relatorios" element={<RelatoriosPage />}/>
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
