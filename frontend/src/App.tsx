import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/homePage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </HashRouter>
  );
}

export default App