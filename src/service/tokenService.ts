import JWTAccessTokenPayload from "../model/jwtAccessTokenPayload";
import JWTRefreshTokenPayload from "../model/jwtRefreshTokenPayload";
import JWTToken from "../model/jwtToken";

interface TokenService {
  generateAccessToken(payload: JWTAccessTokenPayload): string;

  generateRefreshToken(payload: JWTRefreshTokenPayload): string;

  verifyAccessToken(token: string): JWTToken | null;

  verifyRefreshToken(refreshToken: string): JWTToken | null;

  verifyAccessTokenIgnoreExpiry(token: string): JWTToken | null;

  getRefreshToken(userIdBase64Hash: string): Promise<string | null>;

  saveRefreshToken(userIdBase64Hash: string, refreshToken: string): Promise<boolean>;
}

export default TokenService;
