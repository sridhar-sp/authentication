interface TokenRepository {
  getRefreshToken(userId: string): Promise<string | null>;

  saveRefreshToken(userId: string, refreshToken: string): Promise<boolean>;
}

export default TokenRepository;
