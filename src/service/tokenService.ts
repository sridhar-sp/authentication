import JWTAccessTokenPayload from "../model/jwtAccessTokenPayload";
import JWTRefreshTokenPayload from "../model/JWTRefreshTokenPayload";

interface TokenService {
  generateAccessToken(userId: string): string;

  generateRefreshToken(userId: string): string;

  verifyAccessToken(token: string): JWTAccessTokenPayload | null;

  verifyRefreshToken(refreshToken: string): JWTRefreshTokenPayload | null;

  verifyAccessTokenIgnoreExpiry(token: string): JWTRefreshTokenPayload | null;

  getRefreshToken(userId: string): Promise<string | null>;

  saveRefreshToken(userId: string, refreshToken: string): Promise<boolean>;
}

export default TokenService;
