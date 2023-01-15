import { Response, NextFunction } from "express";
import { HTTP_STATUS_CODES } from "../constant/httpStatusCode";
import AuthResponse from "../model/authResponse";
import ErrorResponse from "../model/errorResponse";
import AuthProvider from "./AuthProvider";

class FallbackAuthProvider implements AuthProvider {
  private unAuthErrorResponse = ErrorResponse.unAuthorized("Unauthorized. invalid auth provider");

  async authenticateUser(request: any): Promise<AuthResponse> {
    throw this.unAuthErrorResponse;
  }
  async authenticateUserBasedOnRefreshToken(request: any): Promise<AuthResponse> {
    throw this.unAuthErrorResponse;
  }
  accessTokenValidator(req: any, res: Response, next: NextFunction): void {
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json(this.unAuthErrorResponse);
  }
  verifyAccessToken(req: any, res: Response, next: NextFunction): void {
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json(this.unAuthErrorResponse);
  }
}

export default FallbackAuthProvider;
