export interface JwtUserPayload {
  user: {
    username: string;
    role: 'user' | 'admin' | 'developer' | 'moderator';
    uuid: string;
    nickname: string;
    mail: string;
    balance?: {
      rafflePoints: number;
    };
  }
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
