"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const nfeRoutes_js_1 = __importDefault(require("./routes/nfeRoutes.js")); // Pluga as rotas do XML (Atenção ao .js no final)
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3333; // Mantido na porta 3333 original
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Injeta a rota de leitura de nota fiscal
app.use('/api/nfe', nfeRoutes_js_1.default);
// Rota raiz original mantida idêntica
app.get('/', (req, res) => {
    res.json({ message: 'FarmControl API rodando!' });
});
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
//# sourceMappingURL=server.js.map