import { Router } from 'express';
import multer from 'multer';
import os from 'os'; // Importa o módulo do sistema operacional
import { lerNotaFiscal } from '../controllers/nfeController.js';

const router = Router();

// MODIFICADO: Agora ele usa a pasta TEMP do Windows (onde o OneDrive não tem acesso)
const upload = multer({ dest: os.tmpdir() }); 

// Rota: POST http://localhost:3333/api/nfe/ler
router.post('/ler', upload.single('arquivoXml'), lerNotaFiscal);

export default router;