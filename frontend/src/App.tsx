import { HashRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/homePage";
import Layout from "./components/Layout";
import CadastroManualPage from "./pages/cadastroManualPage";
import CadastroUsuarioPage from "./pages/cadastroUsuarioPage";
import ListarUsuariosPage from "./pages/listarUsuariosPage";
import EditarUsuarioPage from "./pages/editarUsuarioPage";
import VendaPage from "./pages/VendaPage";
import RelatoriosPage from "./pages/RelatoriosPage";
import LoginPage from "./pages/loginPages";
import RotaProtegida from "./components/RotaProtegida";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route element={<Layout />}>

          {/* Todos os cargos */}
          <Route path="/homePage" element={
            <RotaProtegida cargosPermitidos={["BALCONISTA", "FARMACEUTICO", "ADMINISTRADOR"]}>
              <HomePage />
            </RotaProtegida>
          }/>

          <Route path="/compra" element={
            <RotaProtegida cargosPermitidos={["BALCONISTA", "FARMACEUTICO", "ADMINISTRADOR"]}>
              <VendaPage />
            </RotaProtegida>
          }/>

          {/* Farmacêutico e Admin */}
          <Route path="/cadastro-manual" element={
            <RotaProtegida cargosPermitidos={["FARMACEUTICO", "ADMINISTRADOR"]}>
              <CadastroManualPage />
            </RotaProtegida>
          }/>

          {/* Somente Admin */}
          <Route path="/relatorios" element={
            <RotaProtegida cargosPermitidos={["ADMINISTRADOR"]}>
              <RelatoriosPage />
            </RotaProtegida>
          }/>

          <Route path="/usuarios" element={
            <RotaProtegida cargosPermitidos={["ADMINISTRADOR"]}>
              <ListarUsuariosPage />
            </RotaProtegida>
          }/>

          <Route path="/cadastro-usuario" element={
            <RotaProtegida cargosPermitidos={["ADMINISTRADOR"]}>
              <CadastroUsuarioPage />
            </RotaProtegida>
          }/>

          <Route path="/editar-usuario" element={
            <RotaProtegida cargosPermitidos={["ADMINISTRADOR"]}>
              <EditarUsuarioPage />
            </RotaProtegida>
          }/>

        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
