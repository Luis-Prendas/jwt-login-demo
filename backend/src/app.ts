import express, { Request, Response } from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import userSessionRouter from './routes/userSession.routes';
import assistanceRouter from './routes/assistance.routes';
import scheduleRouter from './routes/schedule.routes';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/', (_req: Request, res: Response) => {
  res.send('🚀 API con JWT en TypeScript funcionando correctamente!');
});

// Rutas
app.use('/api/session', userSessionRouter);
app.use('/api/user', userRoutes);
app.use('/api/assistance', assistanceRouter);
app.use('/api/schedule', scheduleRouter);

export default app;
