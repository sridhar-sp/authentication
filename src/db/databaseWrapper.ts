interface DatabaseWrapper {
  setString(key: string, value: string): Promise<boolean>;

  getString(key: string): Promise<string | null>;

  delete(key: string): Promise<boolean>;

  exist(key: string): Promise<boolean>;

  expire(key: string, ttlInSeconds: number): Promise<void>;
}

export default DatabaseWrapper;
