export interface AuthResponse {
  message: string;
  token?: string; // Token bersifat opsional karena response register tidak ada token
  error?: string;
}

export interface LoginPayload {
  username: string;
  password?: string;
}

export interface RegisterPayload {
  username: string;
  password?: string;
}