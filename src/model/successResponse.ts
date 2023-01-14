import { HTTP_STATUS_CODES } from "../constant/httpStatusCode";
import BaseResponse from "./baseResponse";

class SuccessResponse extends BaseResponse {
  data: any;

  constructor(code: number, message: string, data: any) {
    super(code, message);
    this.data = data;
  }

  static createSuccessResponse(data: any) {
    return new SuccessResponse(HTTP_STATUS_CODES.OK, "Success", data);
  }
}

export default SuccessResponse;
