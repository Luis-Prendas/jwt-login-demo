import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const DB = {
  "users": [
    {
      "username": "simil",
      "password": "simil",
      "balance": {
        "rafflePoints": 100
      }
    }
  ]
}

const SECRET_KEY = '455654701';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('🚀 API con JWT en TS funcionando!');
});

app.get('/protected', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // Extraer después de "Bearer"

  if (!token) return res.status(401).json({ error: 'Token faltante' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ message: 'Acceso permitido', user: decoded });
  } catch (err) {
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
});

app.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // Validación básica
    const user = DB.users.find(user => user.username === username && user.password === password);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const payload = user;
    const options = { expiresIn: '1h' as const };
    // 10 seconds for testing purposes
    // const options = { expiresIn: '10s' as const };

    const token = jwt.sign(payload, SECRET_KEY, options);
    console.log(`🔐 Token generado: ${token}`);

    res.json({ token });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Error al generar el token: ${error.message}`);
    } else {
      console.error(`❌ Error al generar el token: ${String(error)}`);
    }
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.get('/user', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // Extraer después de "Bearer"

  if (!token) return res.status(401).json({ error: 'Token faltante' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const username = typeof decoded === 'object' && 'username' in decoded ? (decoded as jwt.JwtPayload).username : undefined;
    const user = DB.users.find(user => user.username === username);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ user });
  } catch (err) {
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
});

app.post('/add-points', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // Extraer después de "Bearer"

  if (!token) return res.status(401).json({ error: 'Token faltante' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const username = typeof decoded === 'object' && 'username' in decoded ? (decoded as jwt.JwtPayload).username : undefined;
    const user = DB.users.find(user => user.username === username);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Agregar puntos al usuario
    user.balance.rafflePoints += req.body.points || 0;
    res.json({ message: 'Puntos agregados exitosamente', user });
  } catch (err) {
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
