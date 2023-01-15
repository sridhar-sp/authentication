import config from "./config";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import redisDbWrapper from "./db/instance";
import TokenServiceImpl from "./service/tokenServiceImpl";
import TokenRepositoryImpl from "./repository/tokenRepositoryImpl";
import AuthServiceImpl from "./service/authServiceImpl";
import logger from "./logger";
import SuccessResponse from "./model/successResponse";
import firebaseTokenValidator from "./validator/firebaseTokenValidator";
import AuthResponse from "./model/authResponse";
import accessTokenValidator from "./validator/accessTokenValidator";
import AccessTokenAuthMiddleware from "./middleware/accessTokenAuthMiddleware";
import FirebaseAuthMiddleware from "./middleware/firebaseAuthMiddleware";
import FirebaseAuthImpl from "./firebase/firebaseAuthUtility";
import ErrorResponse from "./model/errorResponse";
import { HTTP_STATUS_CODES } from "./constant/httpStatusCode";

const TAG = "APP";

const tokenService = new TokenServiceImpl(new TokenRepositoryImpl(redisDbWrapper));
const authService = new AuthServiceImpl(tokenService);

const accessTokenAuthMiddleware = new AccessTokenAuthMiddleware(tokenService);

const firebaeAuth = new FirebaseAuthImpl();
const firebaseAuthMiddleware = new FirebaseAuthMiddleware(firebaeAuth);

const app: express.Application = express();

app.use(bodyParser.json());

app.post(
  "/token",
  firebaseTokenValidator,
  firebaseAuthMiddleware.verifyFirebaseAuth,
  async (req: any, res: express.Response) => {
    authService
      .authenticateUser(req.uid)
      .then((token) => {
        res.status(HTTP_STATUS_CODES.OK).json(SuccessResponse.createSuccessResponse(AuthResponse.create(token)));
      })
      .catch((errorResponse: ErrorResponse) => {
        res.status(errorResponse.code).json(errorResponse);
      });
  }
);

app.post("/token/refresh", accessTokenValidator, async (req: any, res: express.Response) => {
  authService
    .authenticateUserBasedOnRefreshToken(req.accessToken)
    .then((token) => {
      res.status(HTTP_STATUS_CODES.OK).json(SuccessResponse.createSuccessResponse(AuthResponse.create(token)));
    })
    .catch((errorResponse: ErrorResponse) => {
      res.status(errorResponse.code).json(errorResponse);
    });
});

app.use(accessTokenValidator);
app.use(accessTokenAuthMiddleware.verifyAccessToken);

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
