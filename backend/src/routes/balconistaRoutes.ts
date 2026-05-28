// Estamos importando apenas uma peça específica chamada Router de dentro do pacote Express 
// (que gerencia as comunicações de internet do projeto).
import { Router } from 'express';
// Importa a função de cadastro que você acabou de escrever
import { cadastrarBalconista } from '../controllers/balconistaController';

// Router organiza caminhos
const router = Router();
// Requisiçã ode tipo "POST". 
// Usada quando o usuário que enviar/criar  um dado noco
router.post('/balconista', cadastrarBalconista);

export default router;