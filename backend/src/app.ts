import express, { Request, Response } from 'express';
import cors from 'cors';
import sessionRouter from './routes/session.routes';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/', (_req: Request, res: Response) => {
  res.send('🚀 API con JWT en TypeScript funcionando correctamente!');
});

// Rutas
app.use('/api/session', sessionRouter);
// app.use('/api/user', userRoutes);
// app.use('/api/assistance', assistanceRouter);
// app.use('/api/schedule', scheduleRouter);

export default app;
