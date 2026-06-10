// Estamos importando apenas uma peça específica chamada Router de dentro do pacote Express 
// (que gerencia as comunicações de internet do projeto).
import { Router } from 'express';
// Importa a função de cadastro que você acabou de escrever
import { cadastrarUsuario, login, listarUsuarios } from '../controllers/usuarioController';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { cargoMiddleware } from "../middlewares/cargoMiddleware.js";

// Router organiza caminhos
const router = Router();
// Requisiçã ode tipo "POST". 
// Usada quando o usuário que enviar/criar  um dado noco
router.post('/usuario', 
    authMiddleware,
    cargoMiddleware("ADMINISTRADOR"),
    cadastrarUsuario
);

router.post("/login", login);

router.get(
    "/usuario",
    authMiddleware,
    cargoMiddleware("ADMINISTRADOR"),
    listarUsuarios
);

export default router;