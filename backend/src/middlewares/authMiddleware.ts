import { Request, Response, NextFunction } from "express";
import { verificarToken } from "../utils/jwt.js";


interface TokenPayload{
    CPF: string;
    cargo: string;
}

export interface AuthRequest extends Request{
    usuario?: TokenPayload;
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({
                erro: "Token não fornecido!"
            });
        }

        const partes = authHeader.split(" "); 

        if (partes.length !== 2) {
            return res.status(401).json({
                erro: "Token mal formatado!"
            });
        }

        const token = partes[1] as string;

        const decoded = verificarToken(token) as TokenPayload;
        req.usuario = decoded;
        next();

    } catch (error){
        return res.status(401).json({
            erro: "Token inválido ou expirado",
            detalhes: error
        });
    }
}