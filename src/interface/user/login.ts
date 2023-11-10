export type Role = 'guest' | 'admin';

export interface LoginParams {
  email: string;
  password: string;
  remember: boolean;
}

export interface LoginResult {
  token: string;
  username: string;
  role: Role;
}

export interface LogoutParams {
  token: string;
}

export interface LogoutResult {}
