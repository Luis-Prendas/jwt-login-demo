import { createServer } from 'http';
import { PORT } from './config/env';
import app from './app';

const httpServer = createServer(app);

httpServer.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
