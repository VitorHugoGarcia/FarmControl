import { NavLink } from "react-router-dom";

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 rounded-md transition-colors ${
    isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
  }`;

export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
      <h2 className="text-xl font-bold mr-6">FarmControl</h2>
      <nav className="flex gap-2">
        <NavLink to="/homePage" className={linkClasses} end>
          Estoque
        </NavLink>
        <NavLink to="/cadastro-manual" className={linkClasses}>
          Cadastrar Medicamento
        </NavLink>
        <NavLink to="/compra" className={linkClasses}>
          Realizar Compra
        </NavLink>
        <NavLink to="/usuarios" className={linkClasses}>
          Lista de usuários
        </NavLink>
        <NavLink to="/" className={linkClasses}>
          SAIR
        </NavLink>
      </nav>
    </header>
  );
}