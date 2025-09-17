import { Request, Response, NextFunction } from 'express';
import { performance } from 'perf_hooks';
import { getLogger } from '../utils/logger';

const logger = getLogger('Middleware/loggerRequest');

export function loggerRequest(req: Request, res: Response, next: NextFunction) {
  const start = performance.now();

  const { method, originalUrl, ip } = req;

  // Capturamos el final de la respuesta para saber cuándo terminó
  res.on('finish', () => {
    const end = performance.now();
    const duration = end - start;

    const statusCode = res.statusCode;
    const userId = req.user?.id || 'anonymous';
    const orgId = req.user?.organizationId || 'n/a';

    const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

    const info = {
      method,
      route: originalUrl,
      statusCode,
      userId,
      orgId,
      ip,
      duration: `${duration.toFixed(2)}ms`,
    };

    logger[logLevel](`[REQ] ${method} ${originalUrl} → ${statusCode} | user: ${userId} | org: ${orgId} | time: ${info.duration} | ip: ${ip}`);
  });

  next();
}