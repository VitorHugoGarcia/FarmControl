"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const os_1 = __importDefault(require("os")); // Importa o módulo do sistema operacional
const nfeController_js_1 = require("../controllers/nfeController.js");
const router = (0, express_1.Router)();
// MODIFICADO: Agora ele usa a pasta TEMP do Windows (onde o OneDrive não tem acesso)
const upload = (0, multer_1.default)({ dest: os_1.default.tmpdir() });
// Rota: POST http://localhost:3333/api/nfe/ler
router.post('/ler', upload.single('arquivoXml'), nfeController_js_1.lerNotaFiscal);
exports.default = router;
//# sourceMappingURL=nfeRoutes.js.map