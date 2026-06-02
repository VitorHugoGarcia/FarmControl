import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware.js";

export function cargoMiddleware(...cargosPermitidos: string[]) {

    return (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) => {

        const usuario = req.usuario;

        if (!usuario) {
            return res.status(401).json({
                erro: "Usuário não autenticado!"
            });
        }

        if (!cargosPermitidos.includes(usuario.cargo)) {
            return res.status(403).json({
                erro: "Acesso negado!"
            });
        }

        next();

    };

}