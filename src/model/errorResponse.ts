import { HTTP_STATUS_CODES } from "../constant/httpStatusCode";
import BaseResponse from "./baseResponse";

class ErrorResponse extends BaseResponse {
  static createErrorResponse(code: number, message: string) {
    return new ErrorResponse(code, message);
  }

  static unAuthorized() {
    return ErrorResponse.createErrorResponse(HTTP_STATUS_CODES.UNAUTHORIZED, "Unauthorized");
  }

  toJson() {
    return JSON.stringify(this);
  }
}

export default ErrorResponse;
