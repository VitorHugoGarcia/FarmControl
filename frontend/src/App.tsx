import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/homePage";
import Layout from "./components/Layout";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
        </Route> 
      </Routes>
    </HashRouter>
  );
}

export default App