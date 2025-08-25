import { createLogger, format, transports } from 'winston';
import path from 'path';
import fs from 'fs';

// Crear carpeta de logs si no existe
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

/**
 * Factory para crear loggers separados por módulo
 */
export function getLogger(moduleName: string) {
  return createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(({ level, message, timestamp }) => {
        return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
      })
    ),
    transports: [
      new transports.File({
        filename: path.join(logDir, `${moduleName}.log`),
      }),
      new transports.Console(), // opcional: también mostrar en consola
    ],
  });
}
