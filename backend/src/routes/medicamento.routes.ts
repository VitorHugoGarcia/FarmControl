import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import {
  listarMedicamentos,
  buscarMedicamento,
  buscarPorCodigoBarras,
  processarNotaFiscal,
  atualizarMedicamento,
  deletarMedicamento,
  criarMedicamento,
} from "../controllers/medicamento-CRUD.controller";
import { upload } from "../config/multer";
import { realizarCompra } from "../controllers/medicamento-Compra.controller";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, "../../uploads");

const router = Router();

router.get("/", listarMedicamentos);
router.post("/", criarMedicamento);

// Rotas específicas devem vir antes de /:id
router.get("/barcode/:codigo", buscarPorCodigoBarras);
router.post("/nota-fiscal", upload.single("xml"), processarNotaFiscal);
router.post("/compra", realizarCompra);
router.get("/compra/download/:filename", (req, res) => {
  const filename = path.basename(req.params.filename); // evita path traversal
  const filepath = path.join(UPLOADS_DIR, filename);
  res.download(filepath, filename, (err) => {
    if (err) res.status(404).json({ error: "Arquivo não encontrado" });
  });
});

router.get("/:id", buscarMedicamento);
router.put("/:id", atualizarMedicamento);
router.delete("/:id", deletarMedicamento);

export default router;
