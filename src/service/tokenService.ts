import JWTToken from "../model/jwtToken";

interface TokenService {
  generateAccessToken(userId: string): string;

  generateRefreshToken(userId: string): string;

  verifyAccessToken(token: string): JWTToken | null;

  verifyRefreshToken(refreshToken: string): JWTToken | null;

  verifyAccessTokenIgnoreExpiry(token: string): JWTToken | null;

  getRefreshToken(userId: string): Promise<string | null>;

  saveRefreshToken(userId: string, refreshToken: string): Promise<boolean>;
}

export default TokenService;
