import config from "./config";
import express, { Response } from "express";
import bodyParser from "body-parser";
import logger from "./logger";
import AuthResponse from "./model/authResponse";
import ErrorResponse from "./model/errorResponse";
import { HTTP_STATUS_CODES } from "./constant/httpStatusCode";
import AuthProviderFactory from "./auth/authProviderFactory";
import SimpleUserRecord from "./model/simpleUserRecord";

const TAG = "APP";

const app: express.Application = express();

app.use(bodyParser.json());

app.post("/token", async (req: any, res: Response) => {
  AuthProviderFactory.getAuthProvider(req)
    .authenticateUser(req)
    .then((authResponse: AuthResponse) => {
      res.status(HTTP_STATUS_CODES.OK).json(authResponse);
    })
    .catch((errorResponse: ErrorResponse) => {
      res.status(errorResponse.code).json(errorResponse);
    });
});

app.post("/token/refresh", async (req: any, res: Response) => {
  AuthProviderFactory.getAuthProvider(req)
    .authenticateUserBasedOnRefreshToken(req)
    .then((authResponse: AuthResponse) => {
      res.status(HTTP_STATUS_CODES.OK).json(authResponse);
    })
    .catch((errorResponse: ErrorResponse) => {
      res.status(errorResponse.code).json(errorResponse);
    });
});

app.get(
  "/token/verify",
  AuthProviderFactory.accessTokenValidatorMiddleware,
  async (req: any, res: express.Response) => {
    const jwtToken = AuthProviderFactory.getAuthProvider(req).verifyAccessToken(req.accessToken);

    if (jwtToken != null) res.status(HTTP_STATUS_CODES.OK).json(jwtToken);
    else res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json(ErrorResponse.unAuthorized());
  }
);

app.use(AuthProviderFactory.accessTokenValidatorMiddleware); // Verify bearer token and parse and forward accessToken on the request
app.use(AuthProviderFactory.verifyAccessTokenMiddleware); // Validate accessToken and set userId in request

app.get("/users/me", async (req: any, res: express.Response) => {
  AuthProviderFactory.getAuthProvider(req)
    .getUser(req.userId)
    .then((userRecord: SimpleUserRecord) => res.status(HTTP_STATUS_CODES.OK).json(userRecord))
    .catch((errorResponse: ErrorResponse) => {
      res.status(errorResponse.code).json(errorResponse);
    });
});

app.get("/users/:id", async (req: any, res: express.Response) => {
  AuthProviderFactory.getAuthProvider(req)
    .getUser(req.params.id)
    .then((userRecord: SimpleUserRecord) => res.status(HTTP_STATUS_CODES.OK).json(userRecord))
    .catch((errorResponse: ErrorResponse) => {
      res.status(errorResponse.code).json(errorResponse);
    });
});

app.listen(config.port, () => {
  logger.logInfo(TAG, `${config.appName} running on port ${config.port}`);
});
