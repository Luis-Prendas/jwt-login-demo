import { jwtDecode } from "jwt-decode";
import type { UserBasicData } from "../types/UserManagement";

interface JwtPayload {
  exp: number;
  iat: number;
  user: UserBasicData;
}

export const isTokenValid = (token: string): JwtPayload | false => {
  if (!token) return false;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime ? decoded : false;
  } catch (err) {
    return false;
  }
};

export const decodeToken = (token: string): JwtPayload => {
  return jwtDecode<JwtPayload>(token);
};