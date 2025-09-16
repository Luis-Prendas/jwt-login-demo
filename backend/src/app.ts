import express, { Request, Response } from 'express';
import cors from 'cors';
import sessionRouter from './routes/session.routes';
import userRouter from './routes/user.routes';
import organizationRouter from './routes/organization.routes';
import departmentRouter from './routes/department.routes';
import positionRouter from './routes/position.routes';

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
app.use('/api/organization', organizationRouter)
app.use('/api/department', departmentRouter)
app.use('/api/position', positionRouter)
app.use('/api/user', userRouter);

export default app;
