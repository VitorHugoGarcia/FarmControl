import { Navigate, useLocation } from "react-router-dom";
import { getCargo } from "../utils/auth";

type Cargo = "BALCONISTA" | "FARMACEUTICO" | "ADMINISTRADOR";

interface Props {
    cargosPermitidos: Cargo[];
    children: React.ReactNode;
}

export default function RotaProtegida({ cargosPermitidos, children }: Props) {
    const cargo = getCargo() as Cargo | null;
    const location = useLocation();

    if (!cargo) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    if (!cargosPermitidos.includes(cargo)) {
        return <Navigate to="/homePage" replace />;
    }

    return <>{children}</>;
}
