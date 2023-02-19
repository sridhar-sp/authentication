import { Response, NextFunction } from "express";
import { HTTP_STATUS_CODES } from "../constant/httpStatusCode";
import AuthResponse from "../model/authResponse";
import ErrorResponse from "../model/errorResponse";
import JWTToken from "../model/jwtToken";
import SimpleUserRecord from "../model/simpleUserRecord";
import AuthProvider from "./authProvider";

class FallbackAuthProvider implements AuthProvider {
  private unAuthErrorResponse = ErrorResponse.unAuthorized("Unauthorized. invalid auth provider");

  async authenticateUser(request: any): Promise<AuthResponse> {
    throw this.unAuthErrorResponse;
  }
  async authenticateUserBasedOnRefreshToken(request: any): Promise<AuthResponse> {
    throw this.unAuthErrorResponse;
  }

  verifyAccessToken(req: any): JWTToken | null {
    throw this.unAuthErrorResponse;
  }

  async getUser(userId: string): Promise<SimpleUserRecord> {
    throw this.unAuthErrorResponse;
  }

  accessTokenValidatorMiddleware(req: any, res: Response, next: NextFunction): void {
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json(this.unAuthErrorResponse);
  }
  verifyAccessTokenMiddleware(req: any, res: Response, next: NextFunction): void {
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json(this.unAuthErrorResponse);
  }
}

export default FallbackAuthProvider;
