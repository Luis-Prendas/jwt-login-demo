/**
 * Payload que se almacena en el JWT
 */
export interface JwtUserPayload {
  user: {
    uuid: string;
    username: string;
    nickname: string;
    email: string;
    role: 'user' | 'admin' | 'developer' | 'moderator';
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
