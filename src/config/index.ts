import dotenv from "dotenv";

dotenv.config();

type AccessTokenConfig = {
  secret: string;
  expiresIn: string;
};

type RefreshTokenConfig = AccessTokenConfig;

interface Config {
  appName: string;
  port: string;
  redisUrl: string;
  firebaseConfig: string;
  accessTokenConfig: AccessTokenConfig;
  refreshTokenConfig: RefreshTokenConfig;
}

const config: Config = {
  appName: process.env.APP_NAME!!,
  port: process.env.PORT!!,
  redisUrl: process.env.REDIS_URL!!,
  firebaseConfig: JSON.parse(process.env.FIREBASE_CONFIG!!),
  accessTokenConfig: {
    secret: process.env.ACCESS_TOKEN_SECRET!!,
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME!!,
  },
  refreshTokenConfig: {
    secret: process.env.REFRESH_TOKEN_SECRET!!,
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME!!,
  },
};

export default config;
