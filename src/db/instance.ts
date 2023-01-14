import { createClient, RedisClientType } from "redis";
import config from "../config";
import logger from "../logger";
import RedisDatabaseWrapper from "./redisDatabaseWrapper";

const TAG = "RedisClientFactory";

const redisClient: RedisClientType = createClient({ url: config.redisUrl });

redisClient.on("error", (error) => {
  logger.logError(TAG, error);
});

redisClient.on("ready", () => {
  logger.logInfo(TAG, "Redis connected");
});

redisClient.connect(); // async process

export default new RedisDatabaseWrapper(redisClient);
