import { HashRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/loginPages";
import HomePage from "./pages/homePage";
import Layout from "./components/Layout";
import CadastroManualPage from "./pages/cadastroManualPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<Layout />}>
          <Route path="/home" element={<HomePage />}/>
          <Route path="/cadastro-manual" element={<CadastroManualPage />}/>
        </Route> 
      </Routes>
    </HashRouter>
  );
}

export default App;