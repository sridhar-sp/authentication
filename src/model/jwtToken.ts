class JWTToken {
  encUserId: string;
  userIdBase64Hash: string;
  iat: number;
  exp: number;

  constructor(encUserId: string, userIdBase64Hash: string, iat: number, exp: number) {
    this.encUserId = encUserId;
    this.userIdBase64Hash = userIdBase64Hash;
    this.iat = iat;
    this.exp = exp;
  }
}

export default JWTToken;
