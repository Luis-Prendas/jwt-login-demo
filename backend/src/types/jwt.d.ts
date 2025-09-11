import { UserBasicData } from "../controllers/session/session";

/**
 * Payload que se almacena en el JWT
 */
export interface JwtUserPayload {
  user: TBL_user;
  iat?: number;
  exp?: number;
}

/**
 * Extensión del Request de Express para incluir `user`
 */
declare global {
  namespace Express {
    interface Request {
      data?: JwtUserPayload;
    }
  }
}
