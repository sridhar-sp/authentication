interface TokenRepository {
  getRefreshToken(userIdBase64Hash: string): Promise<string | null>;

  saveRefreshToken(userIdBase64Hash: string, refreshToken: string): Promise<boolean>;
}

export default TokenRepository;
