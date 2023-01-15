class AuthResponse {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  static create(token: string) {
    return new AuthResponse(token);
  }
}

export default AuthResponse;
