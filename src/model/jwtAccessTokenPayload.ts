class JWTAccessTokenPayload {
  encUserId: string;
  userIdBase64Hash: string;

  constructor(encUserId: string, userIdBase64Hash: string) {
    this.encUserId = encUserId;
    this.userIdBase64Hash = userIdBase64Hash;
  }

  static createAsJson(encUserId: string, userIdBase64Hash: string) {
    return JSON.parse(JSON.stringify(new JWTAccessTokenPayload(encUserId, userIdBase64Hash)));
  }
}

export default JWTAccessTokenPayload;
