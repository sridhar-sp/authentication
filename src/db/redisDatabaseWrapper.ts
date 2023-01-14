import DatabaseWrapper from "./databaseWrapper";
import { RedisClientType } from "redis";

class RedisDatabaseWrapper implements DatabaseWrapper {
  redisClient: RedisClientType;

  constructor(redisClient: RedisClientType) {
    this.redisClient = redisClient;
  }

  setString(key: string, value: string): Promise<boolean> {
    return new Promise((resolve, reject: (error: Error) => void) => {
      this.redisClient
        .set(key, value)
        .then(() => {
          this.redisClient.set(key, value);
          resolve(true);
        })
        .catch(reject);
    });
  }

  getString(key: string): Promise<string | null> {
    return new Promise((resolve: (value: string | null) => void, reject: (error: Error) => void) => {
      this.redisClient.get(key).then(resolve).catch(reject);
    });
  }

  delete(key: string): Promise<boolean> {
    return new Promise((resolve, reject: (error: Error) => void) => {
      this.redisClient
        .del(key)
        .then((result) => resolve(result === 1))
        .catch(reject);
    });
  }

  exist(key: string): Promise<boolean> {
    return new Promise((resolve: (isExist: boolean) => void, reject: (error: Error) => void) => {
      this.redisClient
        .exists(key)
        .then((result) => resolve(result == 1))
        .catch(reject);
    });
  }

  expire(key: string, ttlInSeconds: number): Promise<void> {
    return new Promise((resolve: () => void, reject: (error: Error) => void) => {
      this.redisClient.expire(key, ttlInSeconds).then(resolve).catch(reject);
    });
  }
}

export default RedisDatabaseWrapper;
