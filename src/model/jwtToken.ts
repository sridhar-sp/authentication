class JWTToken {
  userId: string;
  iat: number;
  exp: number;

  constructor(userId: string, iat: number, exp: number) {
    this.userId = userId;
    this.iat = iat;
    this.exp = exp;
  }

  static create(userId: string, iat: number, exp: number) {
    return new JWTToken(userId, iat, exp);
  }
}

export default JWTToken;
