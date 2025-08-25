import express, { Request, Response } from 'express';
import cors from 'cors';
import sessionRouter from './routes/session.routes';
import userRouter from './routes/user.routes';
import scheduleRouter from './routes/schedule.routes';
import attendanceRouter from './routes/attendance.routes';

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
app.use('/api/user', userRouter);
app.use('/api/schedule', scheduleRouter);
app.use('/api/attendance', attendanceRouter);

export default app;
