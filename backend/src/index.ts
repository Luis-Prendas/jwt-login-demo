import express from 'express';
import cors from 'cors';
import { PORT } from './config/env';
import userSessionRoutes from './routes/userSession';
import userRoutes from './routes/user';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.send('🚀 API con JWT en TS funcionando!'));
app.use('/', userSessionRoutes);
app.use('/', userRoutes);

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
