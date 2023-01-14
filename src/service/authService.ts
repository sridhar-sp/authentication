interface AuthService {
  /**
   *
   * Generate and return accessToken for the {@code userId}.
   * Generate refresh token and persist in cache.
   *
   * @param {*} userId UserId Obtained from firebase
   * @return accessToken
   */
  authenticateUser(userId: string): Promise<string>;

  authenticateUserBasedOnRefreshToken(accessToken: string): Promise<string>;
}

export default AuthService;
