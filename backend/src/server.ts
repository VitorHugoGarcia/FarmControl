import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nfeRoutes from './routes/nfeRoutes.js'; // Pluga as rotas do XML (Atenção ao .js no final)

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333; // Mantido na porta 3333 original

app.use(cors());
app.use(express.json());

// Injeta a rota de leitura de nota fiscal
app.use('/api/nfe', nfeRoutes);

// Rota raiz original mantida idêntica
app.get('/', (req, res) => {
  res.json({ message: 'FarmControl API rodando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});