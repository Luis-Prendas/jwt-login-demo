import { Gender, UserRole } from "@prisma/client";

/**
 * Payload que se almacena en el JWT
 */
export interface PayloadJWT {
  id: string
  email: string
  username: string
  nickname: string
  name: string
  lastName: string
  phone: string | null
  gender: Gender
  birthDate: Date | null
  identificationNumber: string | null
  address: string | null
  role: UserRole
  organizationId: string
  description: string | null
  isDeleted: Boolean
}
export interface JwtUserPayload {
  user: PayloadJWT;
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
