import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

interface JwtUserPayload {
  username: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

const DB = {
  users: [
    {
      username: 'simil',
      password: 'simil',
      balance: {
        rafflePoints: 100
      }
    }
  ]
};

const SECRET_KEY = '455654701';
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Middleware para verificar y decodificar el token
function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token faltante' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtUserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

app.get('/', (_req, res) => {
  res.send('🚀 API con JWT en TS funcionando!');
});

app.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    const user = DB.users.find(u => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const payload = {
      username: user.username,
      balance: user.balance
    };

    const options = { expiresIn: '1h' as const };

    const token = jwt.sign(payload, SECRET_KEY, options);
    console.log(`🔐 Token generado para ${username}: ${token}`);

    res.json({ token });
  } catch (error) {
    console.error(`❌ Error al generar el token: ${String(error)}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Acceso permitido', user: req.user });
});

app.get('/user', authenticateToken, (req, res) => {
  const username = (req.user as jwt.JwtPayload).username;
  const user = DB.users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  res.json({ user });
});

app.post('/add-points', authenticateToken, (req, res) => {
  const username = (req.user as jwt.JwtPayload).username;
  const user = DB.users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const points = Number(req.body.points);

  if (isNaN(points) || points <= 0) {
    return res.status(400).json({ error: 'Cantidad de puntos inválida' });
  }

  user.balance.rafflePoints += points;

  res.json({ message: 'Puntos agregados exitosamente', user });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
