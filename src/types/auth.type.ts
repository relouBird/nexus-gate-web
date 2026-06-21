// types/auth.type.ts

// ─── Payloads (requêtes) ──────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  teamName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SendOtpPayload {
  email: string;
  action: "login" | "reset";
}

export interface VerifyOtpPayload {
  email: string;
  code: string;
}

export interface ResetPasswordPayload {
  email: string;
}

export interface ChangePasswordPayload {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

// ─── Réponses (API) ───────────────────────────────────────────

export interface UserModel {
  id: string;
  username: string;
  email: string;
  role: "CREATOR" | "ADMIN" | "CLIENT";
  teamId: string;
}

export interface TeamModel {
  id: string;
  name: string;
  slug: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface RegisterResponse {
  user: UserModel;
  team: TeamModel;
  status: AuthStatus;
  accessToken: string;
  refreshToken: string;
}

export type LoginResponse = RegisterResponse;

export interface OtpResponse {
  message: string;
}

export interface SendOtpResponse {
  sent: string;
}

// ─── État de la store ─────────────────────────────────────────

export type AuthStatus = "authenticated" | "unauthenticated";
