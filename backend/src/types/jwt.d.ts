/**
 * Payload que se almacena en el JWT
 */
export interface JwtUserPayload {
  user: {
    uuid: string;
    username: string;
    nickname: string;
    email: string; // corregido de 'mail' a 'email' para coherencia
    role: 'user' | 'admin' | 'developer' | 'moderator';
    balance?: {
      rafflePoints: number;
    };
  };
  iat?: number;
  exp?: number;
}

/**
 * Extensión del Request de Express para incluir `user`
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}
