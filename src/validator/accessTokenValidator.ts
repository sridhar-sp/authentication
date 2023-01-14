import { NextFunction, Response } from "express";
import ErrorResponse from "../model/errorResponse";
import logger from "../logger";
import { HTTP_STATUS_CODES } from "../constant/httpStatusCode";

const TAG = "AccessTokenValidator";

const accessTokenValidator = (req: any, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  const accessToken = extractToken(authorization);
  if (!accessToken) {
    logger.logInfo(TAG, "Access token is missing in the headers");
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json(ErrorResponse.unAuthorized());
    return;
  }

  req.accessToken = accessToken;

  next();
};

const extractToken = (authorizationValue: any) => {
  if (!authorizationValue || !(typeof authorizationValue === "string") || authorizationValue.trim() === "") return null;

  const authFields = authorizationValue.split(" ");

  if (!authFields || authFields.length != 2 || authFields[0] !== "Bearer") return null;

  return authFields[1];
};

export default accessTokenValidator;
