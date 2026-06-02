import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nfeRoutes from './routes/nfeRoutes.js'; 
import routerBalconista from './routes/usuarioRoutes.js'; // Adicionado aqui

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333; 

app.use(cors());
app.use(express.json());

app.use('/api/nfe', nfeRoutes);
app.use(routerBalconista); // Adicionado aqui

app.get('/', (req, res) => {
  res.json({ message: 'FarmControl API rodando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
