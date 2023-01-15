import { NextFunction, Response } from "express";
import { HTTP_STATUS_CODES } from "../constant/httpStatusCode";
import ErrorResponse from "../model/errorResponse";

const firebaseTokenValidator = (req: any, res: Response, next: NextFunction) => {
  const userToken = req.body.userToken;

  if (!userToken) {
    res
      .status(HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY)
      .json(ErrorResponse.createErrorResponse(HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY, "User token is missing"));
    return;
  }

  next();
};

export default firebaseTokenValidator;
