import jwt, { Algorithm } from "jsonwebtoken";
import config from "../config";
import JWTAccessTokenPayload from "../model/jwtAccessTokenPayload";
import JWTRefreshTokenPayload from "../model/jwtRefreshTokenPayload";
import JWTToken from "../model/jwtToken";

import TokenRepository from "../repository/tokenRepository";
import TokenService from "./tokenService";

const TAG = "TokenService";

class TokenServiceImpl implements TokenService {
  static JWT_ALGORITHM: Algorithm = "HS256";

  tokenRepository: TokenRepository;

  constructor(tokenRepository: TokenRepository) {
    this.tokenRepository = tokenRepository;
    jwt.verify;
  }

  getRefreshToken(userId: string): Promise<string | null> {
    return this.tokenRepository.getRefreshToken(userId);
  }

  saveRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
    return this.tokenRepository.saveRefreshToken(userId, refreshToken);
  }

  generateAccessToken(userId: string): string {
    return this.generateToken(
      JWTAccessTokenPayload.create(userId).toJson(),
      config.accessTokenConfig.secret,
      config.accessTokenConfig.expiresIn
    );
  }
  generateRefreshToken(userId: string): string {
    return this.generateToken(
      JWTRefreshTokenPayload.create(userId).toJson(),
      config.refreshTokenConfig.secret,
      config.refreshTokenConfig.expiresIn
    );
  }

  verifyAccessToken(token: string): JWTToken | null {
    return this.verifyToken(token, config.accessTokenConfig.secret);
  }

  verifyRefreshToken(refreshToken: string): JWTToken | null {
    return this.verifyToken(refreshToken, config.refreshTokenConfig.secret);
  }

  verifyAccessTokenIgnoreExpiry(token: string): JWTToken | null {
    try {
      return jwt.verify(token, config.accessTokenConfig.secret, {
        algorithms: [TokenServiceImpl.JWT_ALGORITHM],
        ignoreExpiration: true,
      }) as JWTToken;
    } catch (e) {
      return null;
    }
  }

  private generateToken(payload: typeof JWTAccessTokenPayload, secret: string, expiresIn: string) {
    return jwt.sign(payload, secret, {
      algorithm: TokenServiceImpl.JWT_ALGORITHM,
      expiresIn: expiresIn,
    });
  }

  private verifyToken(token: string, secret: string): JWTToken | null {
    try {
      return jwt.verify(token, secret, {
        algorithms: [TokenServiceImpl.JWT_ALGORITHM],
      }) as JWTToken;
    } catch (e) {
      return null;
    }
  }
}

export default TokenServiceImpl;
