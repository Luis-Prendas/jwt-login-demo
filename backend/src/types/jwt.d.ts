export interface JwtUserPayload {
  username: string;
  balance?: {
    rafflePoints: number;
  };
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
