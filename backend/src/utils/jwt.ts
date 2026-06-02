import jwt from "jsonwebtoken";

const JWT_SECRET = "farmcontrol_secret";

export function gerarToken(payload: object){
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "1d"
    });
}

export function verificarToken(token: string){
     return jwt.verify(token, JWT_SECRET);
}