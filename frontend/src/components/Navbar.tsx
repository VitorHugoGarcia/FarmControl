import { NavLink, useNavigate } from "react-router-dom";
import { getCargo } from "../utils/auth";

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 rounded-md transition-colors ${
    isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
  }`;

export default function Navbar() {
  const cargo = getCargo();
  const navigate = useNavigate();

  const sair = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
      <h2 className="text-xl font-bold mr-6">FarmControl</h2>
      <nav className="flex gap-2 flex-1">
        <NavLink to="/homePage" className={linkClasses} end>
          Estoque
        </NavLink>

        {(cargo === "FARMACEUTICO" || cargo === "ADMINISTRADOR") && (
          <NavLink to="/cadastro-manual" className={linkClasses}>
            Cadastrar Medicamento
          </NavLink>
        )}

        <NavLink to="/compra" className={linkClasses}>
          Realizar Venda
        </NavLink>

        {cargo === "ADMINISTRADOR" && (
          <NavLink to="/relatorios" className={linkClasses}>
            Relatórios
          </NavLink>
        )}

        {cargo === "ADMINISTRADOR" && (
          <NavLink to="/usuarios" className={linkClasses}>
            Lista de Usuários
          </NavLink>
        )}
      </nav>

      <button
        onClick={sair}
        className="px-4 py-2 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
      >
        Sair
      </button>
    </header>
  );
}
