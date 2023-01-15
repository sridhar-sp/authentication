import { NextFunction, Response } from "express";
import AuthResponse from "../model/authResponse";
import JWTToken from "../model/jwtToken";
import SimpleUserRecord from "../model/simpleUserRecord";

interface AuthProvider {
  authenticateUser(request: any): Promise<AuthResponse>;
  authenticateUserBasedOnRefreshToken(request: any): Promise<AuthResponse>;
  verifyAccessToken(req: any): JWTToken | null;
  getUser(userId: string): Promise<SimpleUserRecord>;

  accessTokenValidatorMiddleware(req: any, res: Response, next: NextFunction): void;
  verifyAccessTokenMiddleware(req: any, res: Response, next: NextFunction): void;
}

export default AuthProvider;
