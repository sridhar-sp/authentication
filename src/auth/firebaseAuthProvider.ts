import { Response, NextFunction } from "express";
import { HTTP_STATUS_CODES } from "../constant/httpStatusCode";
import FirebaseAuth from "../firebase/firebaseAuth";
import logger from "../logger";
import AuthResponse from "../model/authResponse";
import ErrorResponse from "../model/errorResponse";
import SimpleUserRecord from "../model/simpleUserRecord";
import JWTToken from "../model/jwtToken";
import TokenService from "../service/tokenService";
import AuthProvider from "./authProvider";
import CryptoUtils from "../crypto/cryptoUtils";
import config from "../config";
import JWTAccessTokenPayload from "../model/jwtAccessTokenPayload";
import JWTRefreshTokenPayload from "../model/jwtRefreshTokenPayload";

const TAG = "FirebaseAuthProvider";

class FirebaseAuthProvider implements AuthProvider {
  tokenService: TokenService;
  firebaseAuth: FirebaseAuth;
  cryptoUtils: CryptoUtils;

  constructor(tokenService: TokenService, firebaseAuth: FirebaseAuth, cryptoUtils: CryptoUtils) {
    this.tokenService = tokenService;
    this.firebaseAuth = firebaseAuth;
    this.cryptoUtils = cryptoUtils;
  }

  async authenticateUser(request: any): Promise<AuthResponse> {
    const userToken = request.body.userToken;

    if (!userToken) {
      throw ErrorResponse.createErrorResponse(HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY, "User token is missing");
    }

    try {
      const uid = await this.firebaseAuth.verifyFirebaseAuth(userToken);
      try {
        const accessToken = await this.authenticate(uid);
        return new AuthResponse(accessToken);
      } catch (e: any) {
        throw ErrorResponse.createErrorResponse(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, e.message);
      }
    } catch (e: any) {
      logger.logError(TAG, e.message);
      throw ErrorResponse.unAuthorized();
    }
  }

  async authenticateUserBasedOnRefreshToken(request: any): Promise<AuthResponse> {
    const accessToken = this.parseAccessTokenFromRequest(request);
    if (!accessToken) {
      logger.logInfo(TAG, "Access token is missing in the headers");
      throw ErrorResponse.unAuthorized();
    }

    try {
      const newAccessToken = await this.authenticateBasedOnRefreshToken(accessToken);
      return new AuthResponse(newAccessToken);
    } catch (e: any) {
      logger.logError(TAG, e.message || e);
      throw ErrorResponse.unAuthorized();
    }
  }

  async getUser(userId: string): Promise<SimpleUserRecord> {
    try {
      const userRecord = await this.firebaseAuth.getUser(userId);
      return SimpleUserRecord.fromFirebaseUserRecord(userRecord.toJSON());
    } catch (e) {
      throw ErrorResponse.createErrorResponse(HTTP_STATUS_CODES.NOT_FOUND, "No record found");
    }
  }

  verifyAccessToken(accessToken: string): JWTToken | null {
    return this.tokenService.verifyAccessToken(accessToken); // Check integrity and expiry of the accessToken
  }

  accessTokenValidatorMiddleware(req: any, res: Response, next: NextFunction): void {
    const accessToken = this.parseAccessTokenFromRequest(req);

    if (!accessToken) {
      logger.logInfo(TAG, "Access token is missing in the headers");
      res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json(ErrorResponse.unAuthorized());
      return;
    }

    req.accessToken = accessToken;

    next();
  }

  verifyAccessTokenMiddleware(req: any, res: Response, next: NextFunction): void {
    const payload = this.verifyAccessToken(req.accessToken); // Check integrity and expiry of the accessToken

    if (payload == null) {
      res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json(ErrorResponse.unAuthorized());
      return;
    }

    try {
      req.userId = this.cryptoUtils.decryptString(payload.encUserId, config.tokenEncryptSecret);
    } catch (e: any) {
      logger.logError(TAG, e);
      res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json(ErrorResponse.unAuthorized());
      return;
    }

    next();
  }

  private authenticate(userId: string): Promise<string> {
    return new Promise((resolve: (accessToken: string) => void, reject: (error: ErrorResponse) => void) => {
      const encUserId = this.cryptoUtils.encryptString(userId, config.tokenEncryptSecret);
      const userIdBase64Hash = this.cryptoUtils.createSha256Base64Hash(userId);

      const accessToken = this.tokenService.generateAccessToken(
        JWTAccessTokenPayload.createAsJson(encUserId, userIdBase64Hash)
      );
      const refreshToken = this.tokenService.generateRefreshToken(
        JWTRefreshTokenPayload.createAsJson(encUserId, userIdBase64Hash)
      );

      this.tokenService
        .saveRefreshToken(userIdBase64Hash, refreshToken)
        .then(() => resolve(accessToken))
        .catch(reject);
    });
  }

  private authenticateBasedOnRefreshToken(prevAccessToken: string): Promise<string> {
    return new Promise(async (resolve: (accessToken: string) => void, reject: (error: any) => void) => {
      try {
        const accessTokenPayload = await this.verifyAccessTokenIgnoreExpiry(prevAccessToken);
        const refreshToken = await this.tokenService.getRefreshToken(accessTokenPayload.userIdBase64Hash);
        const refreshTokenPayload = await this.verifyRefreshToken(refreshToken!!);
        const newAccessToken = this.tokenService.generateAccessToken(
          JWTAccessTokenPayload.createAsJson(refreshTokenPayload.encUserId, refreshTokenPayload.userIdBase64Hash)
        );
        return resolve(newAccessToken);
      } catch (error) {
        return reject(error);
      }
    });
  }

  private verifyAccessTokenIgnoreExpiry(accessToken: string): Promise<JWTToken> {
    return new Promise((resolve: (tokenPayload: JWTToken) => void, reject: (error: string) => void) => {
      const payload = this.tokenService.verifyAccessTokenIgnoreExpiry(accessToken);
      if (payload != null) resolve(payload);
      else reject("Error while extracting access token payload");
    });
  }

  private verifyRefreshToken(refreshToken: string): Promise<JWTToken> {
    return new Promise((resolve: (tokenPayload: JWTToken) => void, reject: (error: string) => void) => {
      const payload = this.tokenService.verifyRefreshToken(refreshToken);
      if (payload != null) resolve(payload);
      else reject("Error while extracing refresh token payload");
    });
  }

  private parseAccessTokenFromRequest = (req: any) => {
    const authorizationValue = req.headers.authorization;

    if (!authorizationValue || !(typeof authorizationValue === "string") || authorizationValue.trim() === "")
      return null;

    const authFields = authorizationValue.split(" ");

    if (!authFields || authFields.length != 2 || authFields[0] !== "Bearer") return null;

    return authFields[1];
  };
}

export default FirebaseAuthProvider;
