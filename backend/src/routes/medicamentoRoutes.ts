import { Router } from "express";
import {
  listarMedicamentos,
  buscarMedicamento,
  processarNotaFiscal,
  atualizarMedicamento,
  deletarMedicamento,
  realizarCompra,
} from "../controllers/medicamentoController";
import { upload } from "../config/multer";

const router = Router();

router.get("/", listarMedicamentos);
router.get("/:id", buscarMedicamento);
router.post("/nota-fiscal", upload.single("xml"), processarNotaFiscal);
router.put("/:id", atualizarMedicamento);
router.delete("/:id", deletarMedicamento);
router.patch("/:id/compra", realizarCompra);

export default router;