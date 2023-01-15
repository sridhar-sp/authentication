import { NextFunction, Request, Response } from "express";
import FirebaseAuthImpl from "../firebase/firebaseAuthUtility";
import TokenRepositoryImpl from "../repository/tokenRepositoryImpl";
import TokenServiceImpl from "../service/tokenServiceImpl";
import AuthProvider from "./AuthProvider";
import FirebaseAuthProvider from "./FirebaseAuthProvider";
import redisDbWrapper from "../db/instance";
import FallbackAuthProvider from "./FallbackAuthProvider";

enum AUTH_PROVIDER {
  FIREBASE = "firebase",
}

class AuthProviderFactory {
  private static authProviderCache: Map<string, AuthProvider> = new Map();

  private constructor() {}

  private static fallbackAuthProvider = new FallbackAuthProvider();

  static getAuthProvider(request: Request): AuthProvider {
    if (request.headers["X-Auth-Provider"] && request.headers["X-Auth-Provider"] === AUTH_PROVIDER.FIREBASE) {
      const cachedFirebaseProvider = AuthProviderFactory.authProviderCache.get(AUTH_PROVIDER.FIREBASE);
      if (cachedFirebaseProvider) return cachedFirebaseProvider;

      const tokenService = new TokenServiceImpl(new TokenRepositoryImpl(redisDbWrapper));
      const firebaseAuth = new FirebaseAuthImpl();

      const firebaseAuthProvider = new FirebaseAuthProvider(tokenService, firebaseAuth);
      AuthProviderFactory.authProviderCache.set(AUTH_PROVIDER.FIREBASE, firebaseAuthProvider);
      return firebaseAuthProvider;
    } else {
      return AuthProviderFactory.fallbackAuthProvider;
    }
  }

  static accessTokenValidator(req: any, res: Response, next: NextFunction): void {
    return AuthProviderFactory.getAuthProvider(req).accessTokenValidator(req, res, next);
  }

  static verifyAccessToken(req: any, res: Response, next: NextFunction): void {
    return AuthProviderFactory.getAuthProvider(req).verifyAccessToken(req, res, next);
  }
}

export default AuthProviderFactory;
