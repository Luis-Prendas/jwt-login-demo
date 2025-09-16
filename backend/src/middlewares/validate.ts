import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { getLogger } from '../utils/logger';

const logger = getLogger('Middleware/validateBody');

export const validateBody =
  <T extends z.ZodTypeAny>(schema: T) =>
    (req: Request, res: Response, next: NextFunction) => {
      logger.info(`------------ ${req.method} ${req.originalUrl} Iniciado ------------`);
      try {
        logger.info(`Validando req.body.content -> { ${JSON.stringify(req.body.content)} }`);

        const parsed = schema.safeParse(req.body.content);

        if (!parsed.success) {
          logger.info(`req.body.content invalidado -> { ${JSON.stringify(req.body.content)} }`);
          return res.status(400).json({
            error: 'Validation failed',
            details: parsed.error.flatten(),
          });
        }

        logger.info(`req.body.content validado -> { ${JSON.stringify(req.body.content)} }`);
        req.body.content = parsed.data;
        next();
      } finally {
        logger.info(`------------ ${req.method} ${req.originalUrl} Finalizado ------------\n`);
      }
    };
