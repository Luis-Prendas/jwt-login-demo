import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import sessionRouter from './routes/session.routes';
import userRouter from './routes/user.routes';
import organizationRouter from './routes/organization.routes';
import { ApiError } from './utils/ApiError';
import departmentRouter from './routes/department.routes';
import positionRouter from './routes/position.routes';
import { loggerRequest } from './middlewares/loggerRequest';
import { getLogger } from './utils/logger';

const logger = getLogger('app');

const app = express();

// ========================
// 1. Middlewares de Seguridad
// ========================
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

// ========================
// 2. Rate Limiting
// ========================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite por IP
  message: 'Demasiadas solicitudes desde esta IP, inténtalo de nuevo más tarde.'
});
app.use(apiLimiter);

// ========================
// 3. Body Parsers + Logging
// ========================
app.use(loggerRequest);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================
// 4. Rutas
// ========================
app.get('/', (_req: Request, res: Response) => {
  res.send('🚀 API con JWT en TypeScript funcionando correctamente!');
});

app.use('/api/session', sessionRouter);

// ========================
// 5. Middleware de Autenticación Global
// ========================
// app.use(authenticateToken); // <-- Si quieres aplicar a todas las rutas debajo
app.use('/api/organization', organizationRouter);
app.use('/api/department', departmentRouter);
app.use('/api/position', positionRouter);
app.use('/api/user', userRouter);

// ========================
// 6. Manejo Centralizado de Errores
// ========================
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, 'Ruta no encontrada'));
});

app.use((err: Error | ApiError, req: Request, res: Response, _next: NextFunction) => {
  const status = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || 'Error interno del servidor';
  const details = (err instanceof ApiError && err.details) || undefined;

  logger.error(`[ERROR] ${req.method} ${req.originalUrl} :: ${message}`);
  res.status(status).json({ error: message, details });
});

export default app;