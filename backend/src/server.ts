import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import medicamentoRoutes from './routes/medicamento.routes.js';
import routerBalconista from './routes/usuarioRoutes.js';
import relatoriosRoutes from './routes/relatorios.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

app.use('/medicamentos', medicamentoRoutes);
app.use('/relatorios', relatoriosRoutes);
app.use(routerBalconista);

app.get('/', (req, res) => {
  res.json({ message: 'FarmControl API rodando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});