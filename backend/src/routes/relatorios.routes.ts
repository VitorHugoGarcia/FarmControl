import { Router } from "express";
import {
  relatorioValidade,
  relatorioEstoque,
  relatorioLucros,
} from "../controllers/relatorios.controller";

const router = Router();

router.get("/validade", relatorioValidade);
router.get("/estoque", relatorioEstoque);
router.get("/lucros", relatorioLucros);

export default router;
