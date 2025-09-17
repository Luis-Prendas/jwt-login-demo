// logger.ts
import { createLogger, format, transports, Logger } from 'winston';
import path from 'path';
import fs from 'fs';

const logDir = path.join(__dirname, '../../logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFormat = format.printf(({ level, message, timestamp, module }) => {
  return `[${timestamp}] [${level.toUpperCase()}]${module ? ` [${module}]` : ''} ${message}`;
});

export function getLogger(moduleName?: string): Logger {
  const logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),
      format.splat(),
      format.simple(),
      format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
      logFormat
    ),
    transports: [
      new transports.File({
        filename: path.join(logDir, 'error.log'),
        level: 'error',
      }),
      new transports.File({
        filename: path.join(logDir, `${moduleName ? moduleName : 'app'}.log`),
      }),
    ],
  });

  // Mostrar en consola solo si NO es producción
  if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.timestamp({ format: 'HH:mm:ss' }),
          logFormat
        ),
      })
    );
  }

  // Envolver para inyectar nombre del módulo en cada mensaje automáticamente
  const wrapMethod = (level: keyof Logger, originalFn: any) => {
    return function (message: any, ...args: any[]) {
      originalFn.call(logger, { message, module: moduleName ?? 'app' }, ...args);
    };
  };

  return {
    ...logger,
    info: wrapMethod('info', logger.info),
    error: wrapMethod('error', logger.error),
    warn: wrapMethod('warn', logger.warn),
    debug: wrapMethod('debug', logger.debug),
  } as Logger;
}