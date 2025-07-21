import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
  iat: number;
  username: string;
}

export const isTokenValid = (token: string | null): JwtPayload | false => {
  if (!token) return false;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    console.log(`🔍 Token decodificado: ${JSON.stringify(decoded)}`);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime ? decoded : false;
  } catch (err) {
    return false;
  }
};
