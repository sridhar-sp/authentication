import { Response, NextFunction } from "express";
import { HTTP_STATUS_CODES } from "../constant/httpStatusCode";
import FirebaseAuth from "../firebase/firebaseAuth";
import logger from "../logger";
import AuthResponse from "../model/authResponse";
import ErrorResponse from "../model/errorResponse";
import JWTAccessTokenPayload from "../model/jwtAccessTokenPayload";
import JWTRefreshTokenPayload from "../model/JWTRefreshTokenPayload";
import TokenService from "../service/tokenService";
import AuthProvider from "./AuthProvider";

const TAG = "FirebaseAuthProvider";

class FirebaseAuthProvider implements AuthProvider {
  tokenService: TokenService;
  firebaseAuth: FirebaseAuth;

  constructor(tokenService: TokenService, firebaseAuth: FirebaseAuth) {
    this.tokenService = tokenService;
    this.firebaseAuth = firebaseAuth;
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
    } catch (e) {
      throw ErrorResponse.unAuthorized();
    }
  }

  accessTokenValidator(req: any, res: Response, next: NextFunction): void {
    const accessToken = this.parseAccessTokenFromRequest(req);

    if (!accessToken) {
      logger.logInfo(TAG, "Access token is missing in the headers");
      res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json(ErrorResponse.unAuthorized());
      return;
    }

    req.accessToken = accessToken;

    next();
  }

  verifyAccessToken(req: any, res: Response, next: NextFunction): void {
    const payload = this.tokenService.verifyAccessToken(req.accessToken); // Check integrity and expiry of the accessToken

    if (payload == null) {
      res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json(ErrorResponse.unAuthorized());
      return;
    }

    next();
  }

  private authenticate(userId: string): Promise<string> {
    return new Promise((resolve: (accessToken: string) => void, reject: (error: ErrorResponse) => void) => {
      const accessToken = this.tokenService.generateAccessToken(userId);
      const refreshToken = this.tokenService.generateRefreshToken(userId);

      this.tokenService
        .saveRefreshToken(userId, refreshToken)
        .then(() => resolve(accessToken))
        .catch(reject);
    });
  }

  private authenticateBasedOnRefreshToken(prevAccessToken: string): Promise<string> {
    return new Promise(async (resolve: (accessToken: string) => void, reject: (error: any) => void) => {
      try {
        const accessTokenPayload = await this.verifyAccessTokenIgnoreExpiry(prevAccessToken);
        const refreshToken = await this.tokenService.getRefreshToken(accessTokenPayload.userId);
        const refreshTokenPayload = await this.verifyRefreshToken(refreshToken!);
        const newAccessToken = this.tokenService.generateAccessToken(refreshTokenPayload.userId);
        return resolve(newAccessToken);
      } catch (error) {
        return reject(error);
      }
    });
  }

  private verifyAccessTokenIgnoreExpiry(accessToken: string): Promise<JWTAccessTokenPayload> {
    return new Promise((resolve: (tokenPayload: JWTAccessTokenPayload) => void, reject: (error: string) => void) => {
      const payload = this.tokenService.verifyAccessTokenIgnoreExpiry(accessToken);
      if (payload != null) resolve(payload);
      else reject("Error while extracting access token payload");
    });
  }

  private verifyRefreshToken(refreshToken: string): Promise<JWTRefreshTokenPayload> {
    return new Promise((resolve: (tokenPayload: JWTRefreshTokenPayload) => void, reject: (error: string) => void) => {
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
