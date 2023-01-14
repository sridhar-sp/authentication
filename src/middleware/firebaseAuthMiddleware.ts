import { NextFunction, Response } from "express";
import { HTTP_STATUS_CODES } from "../constant/httpStatusCode";
import FirebaseAuth from "../firebase/firebaseAuth";
import logger from "../logger";
import ErrorResponse from "../model/errorResponse";

const TAG = "FirebaseAuthMiddleware";

class FirebaseAuthMiddleware {
  firebaseAuth: FirebaseAuth;

  constructor(firebaseAuth: FirebaseAuth) {
    this.firebaseAuth = firebaseAuth;
  }

  verifyFirebaseAuth = (req: any, res: Response, next: NextFunction) => {
    this.firebaseAuth
      .verifyFirebaseAuth(req.body.userToken)
      .then((uid: string) => {
        req.uid = uid; // Decoded firebase user id
        next();
      })
      .catch((error) => {
        logger.logError(TAG, error);
        res.status(HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY).json(ErrorResponse.unAuthorized());
      });
  };
}

export default FirebaseAuthMiddleware;
