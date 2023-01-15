import config from "./config";
import express, { Response } from "express";
import bodyParser from "body-parser";
import logger from "./logger";
import SuccessResponse from "./model/successResponse";
import AuthResponse from "./model/authResponse";
import ErrorResponse from "./model/errorResponse";
import { HTTP_STATUS_CODES } from "./constant/httpStatusCode";
import AuthProviderFactory from "./auth/AuthProviderFactory";

const TAG = "APP";

const app: express.Application = express();

app.use(bodyParser.json());

app.post("/token", async (req: any, res: Response) => {
  AuthProviderFactory.getAuthProvider(req)
    .authenticateUser(req.uid)
    .then((authResponse: AuthResponse) => {
      res.status(HTTP_STATUS_CODES.OK).json(authResponse);
    })
    .catch((errorResponse: ErrorResponse) => {
      res.status(errorResponse.code).json(errorResponse);
    });
});

app.post("/token/refresh", async (req: any, res: Response) => {
  AuthProviderFactory.getAuthProvider(req)
    .authenticateUserBasedOnRefreshToken(req.accessToken)
    .then((authResponse: AuthResponse) => {
      res.status(HTTP_STATUS_CODES.OK).json(authResponse);
    })
    .catch((errorResponse: ErrorResponse) => {
      res.status(errorResponse.code).json(errorResponse);
    });
});

app.use(AuthProviderFactory.accessTokenValidator);
app.use(AuthProviderFactory.verifyAccessToken);

app.post("/token/verify", async (req: any, res: express.Response) => {
  res.status(200).json(SuccessResponse.createSuccessResponse("verify"));
});

app.post("/users/me", async (req: any, res: express.Response) => {
  res.status(200).json(SuccessResponse.createSuccessResponse("Me"));
});

app.post("/users/:id", async (req: any, res: express.Response) => {
  res.status(200).json(SuccessResponse.createSuccessResponse("Id"));
});

app.listen(config.port, () => {
  logger.logInfo(TAG, `${config.appName} running on port ${config.port}`);
});
