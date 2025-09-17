import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { getLogger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';

const logger = getLogger('Middleware/validateBody');

export const validateBody =
  <T extends z.ZodTypeAny>(schema: T) =>
    (req: Request, res: Response, next: NextFunction) => {
      logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);
      try {
        logger.info(`Validando req.body -> { ${JSON.stringify(req.body)} }`);

        const parsed = schema.safeParse(req.body);

        if (!parsed.success) {
          logger.warn(`Error de validación → ${JSON.stringify(z.treeifyError(parsed.error))}`);
          throw new ApiError(400, 'Error de validación', z.treeifyError(parsed.error));
        }

        logger.info(`req.body validado -> { ${JSON.stringify(req.body)} }`);
        req.body = parsed.data;
        next();
      } finally {
        logger.info(`------------ ${req.method} ${req.originalUrl} Finalizado ------------\n`);
      }
    };
