import { Router } from "express";
import {
  listarMedicamentos,
  buscarMedicamento,
  processarNotaFiscal,
  atualizarMedicamento,
  deletarMedicamento,
  criarMedicamento,
} from "../controllers/medicamento-CRUD.controller";
import { upload } from "../config/multer";
import { 
  downloadArquivo,
  realizarCompra 
} from "../controllers/medicamento-Compra.controller";

const router = Router();

router.get("/", listarMedicamentos);
router.post("/", criarMedicamento);
router.get("/:id", buscarMedicamento);
router.post("/nota-fiscal", upload.single("xml"), processarNotaFiscal);
router.get("/compra/download/:arquivo", downloadArquivo);
router.put("/:id", atualizarMedicamento);
router.delete("/:id", deletarMedicamento);
router.post("/compra", realizarCompra);

export default router;