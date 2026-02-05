import { apiPost } from "../api";
import { setToken } from "./token";

export type RegisterRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  expiresUtc: string;
  roles: string[];
};

export async function register(req: RegisterRequest): Promise<void> {
  await apiPost<void>("/api/Auth/register", req);
}

export async function login(req: LoginRequest): Promise<AuthResponse> {
  const data = await apiPost<AuthResponse>("/api/Auth/login", req);
  setToken(data.accessToken);
  return data;
}