import DatabaseWrapper from "../db/databaseWrapper";
import TokenRepository from "./tokenRepository";

enum KEY {
  PARTIAL_KEY_REFRESH_TOKEN = "key_refresh_token_",
}

class TokenRepositoryImpl implements TokenRepository {
  dbWrapper: DatabaseWrapper;

  constructor(dbWrapper: DatabaseWrapper) {
    this.dbWrapper = dbWrapper;
  }

  getRefreshToken(userIdBase64Hash: string): Promise<string | null> {
    return this.dbWrapper.getString(KEY.PARTIAL_KEY_REFRESH_TOKEN + userIdBase64Hash);
  }

  saveRefreshToken(userIdBase64Hash: string, refreshToken: string): Promise<boolean> {
    return this.dbWrapper.setString(KEY.PARTIAL_KEY_REFRESH_TOKEN + userIdBase64Hash, refreshToken);
  }
}

export default TokenRepositoryImpl;
