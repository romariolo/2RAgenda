// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes'; // Importaremos as rotas

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Permite requisições de outras origens (do nosso frontend)
app.use(express.json()); // Permite que o Express entenda JSON

// Rotas da API
app.use('/api/users', userRoutes);
// Outras rotas (appointments, etc.) virão aqui

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});