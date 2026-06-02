import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "farmcontrol_secret";

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

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        ) as unknown as TokenPayload;

    } catch (error){
        return res.status(401).json({
            erro: "Token incálido ou expirado",
            detalhes: error
        });
    }
}