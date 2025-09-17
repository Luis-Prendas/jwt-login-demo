import type { Gender, UserRole } from "@/types";
import { jwtDecode } from "jwt-decode";

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

export const isTokenValid = (token: string): JwtUserPayload | false => {
  if (!token) return false;

  try {
    const decoded = jwtDecode<JwtUserPayload>(token);
    if (!decoded.exp || !decoded.iat) return false
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime ? decoded : false;
  } catch (err) {
    return false;
  }
};

export const decodeToken = (token: string): JwtUserPayload => {
  return jwtDecode<JwtUserPayload>(token);
};