import { HTTP_STATUS_CODES } from "../constant/httpStatusCode";
import ErrorResponse from "../model/errorResponse";
import JWTAccessTokenPayload from "../model/jwtAccessTokenPayload";
import JWTRefreshTokenPayload from "../model/JWTRefreshTokenPayload";
import AuthService from "./authService";
import TokenService from "./tokenService";

class AuthServiceImpl implements AuthService {
  tokenService: TokenService;

  constructor(tokenService: TokenService) {
    this.tokenService = tokenService;
  }

  authenticateUser(userId: string): Promise<string> {
    return new Promise((resolve: (accessToken: string) => void, reject: (error: ErrorResponse) => void) => {
      const accessToken = this.tokenService.generateAccessToken(userId);
      const refreshToken = this.tokenService.generateRefreshToken(userId);

      this.tokenService
        .saveRefreshToken(userId, refreshToken)
        .then(() => resolve(accessToken))
        .catch((error) =>
          reject(ErrorResponse.createErrorResponse(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, error.message))
        );
    });
  }

  authenticateUserBasedOnRefreshToken(prevAccessToken: string): Promise<string> {
    return new Promise(async (resolve: (accessToken: string) => void, reject: (error: ErrorResponse) => void) => {
      try {
        const accessTokenPayload = await this.verifyAccessTokenIgnoreExpiry(prevAccessToken);
        const refreshToken = await this.tokenService.getRefreshToken(accessTokenPayload.userId);
        const refreshTokenPayload = await this.verifyRefreshToken(refreshToken!);
        const newAccessToken = this.tokenService.generateAccessToken(refreshTokenPayload.userId);
        return resolve(newAccessToken);
      } catch (error) {
        return reject(ErrorResponse.unAuthorized());
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
}

export default AuthServiceImpl;
