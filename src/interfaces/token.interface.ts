export interface Token {
  token: string;
  expiresIn: number;
}

export interface DataStoredInToken {
  _email: string;
}
