import { NextFunction, Response } from "express";
import TokenService from "../service/tokenService";
import ErrorResponse from "../model/errorResponse";
import logger from "../logger/logger";
import { HTTP_STATUS_CODES } from "../constant/httpStatusCode";

const TAG = "AccessTokenAuthMiddleware";

class AccessTokenAuthMiddleware {
  tokenService: TokenService;

  constructor(tokenService: TokenService) {
    this.tokenService = tokenService;
  }

  verifyAccessToken = (req: any, res: Response, next: NextFunction) => {
    const payload = this.tokenService.verifyAccessToken(req.accessToken); // Check integrity and expiry of the accessToken

    if (payload == null) {
      logger.logInfo(TAG, "Payload is null");
      res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json(ErrorResponse.unAuthorized());
      return;
    }

    next();
  };
}

export default AccessTokenAuthMiddleware;
