export interface AdminSession {
  email: string;
  role: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}
