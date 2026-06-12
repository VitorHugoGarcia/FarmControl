import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/homePage";
import Layout from "./components/Layout";
import CadastroManualPage from "./pages/cadastroManualPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />}/>
          <Route path="/cadastro-manual" element={<CadastroManualPage />}/>
        </Route> 
      </Routes>
    </HashRouter>
  );
}

export default App