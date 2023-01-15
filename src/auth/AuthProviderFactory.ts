import { NextFunction, Request, Response } from "express";
import FirebaseAuthImpl from "../firebase/firebaseAuthUtility";
import TokenRepositoryImpl from "../repository/tokenRepositoryImpl";
import TokenServiceImpl from "../service/tokenServiceImpl";
import AuthProvider from "./authProvider";
import FirebaseAuthProvider from "./firebaseAuthProvider";
import redisDbWrapper from "../db/instance";
import FallbackAuthProvider from "./fallbackAuthProvider";

enum AUTH_PROVIDER {
  FIREBASE = "firebase",
}

const AUTH_PROVIDER_HEADER_KEY = "x-auth-provider";

class AuthProviderFactory {
  private static authProviderCache: Map<string, AuthProvider> = new Map();

  private constructor() {}

  private static fallbackAuthProvider = new FallbackAuthProvider();

  static getAuthProvider(request: Request): AuthProvider {
    if (
      request.headers[AUTH_PROVIDER_HEADER_KEY] &&
      request.headers[AUTH_PROVIDER_HEADER_KEY] === AUTH_PROVIDER.FIREBASE
    ) {
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

  static accessTokenValidatorMiddleware(req: any, res: Response, next: NextFunction): void {
    return AuthProviderFactory.getAuthProvider(req).accessTokenValidatorMiddleware(req, res, next);
  }

  static verifyAccessTokenMiddleware(req: any, res: Response, next: NextFunction): void {
    return AuthProviderFactory.getAuthProvider(req).verifyAccessTokenMiddleware(req, res, next);
  }
}

export default AuthProviderFactory;
