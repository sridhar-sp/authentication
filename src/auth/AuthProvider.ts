import { NextFunction, Response } from "express";
import AuthResponse from "../model/authResponse";

interface AuthProvider {
  authenticateUser(request: any): Promise<AuthResponse>;
  authenticateUserBasedOnRefreshToken(request: any): Promise<AuthResponse>;

  accessTokenValidator(req: any, res: Response, next: NextFunction): void;
  verifyAccessToken(req: any, res: Response, next: NextFunction): void;
}

export default AuthProvider;
