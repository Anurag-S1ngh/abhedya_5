import { apiClient } from "./client"

export interface SignupPayload {
  username: string
  email: string
  password: string
}

export interface LoginPayload {
  username: string
  password: string
}

export interface VerifyEmailPayload {
  email: string
  otp: string
}

export interface ResendVerificationOTPPayload {
  email: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  email: string
  otp: string
  password: string
}

export async function signup(payload: SignupPayload) {
  const { data } = await apiClient.post<{ message: string }>("/signup", payload)
  return data
}

export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post<{ message: string; token?: string }>(
    "/login",
    payload
  )
  return data
}

export async function verifyEmail(payload: VerifyEmailPayload) {
  const { data } = await apiClient.post<{ message: string }>(
    "/verify-email",
    payload
  )
  return data
}

export async function resendVerificationOTP(
  payload: ResendVerificationOTPPayload
) {
  const { data } = await apiClient.post<{ message: string }>(
    "/resend-verification-otp",
    payload
  )
  return data
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  const { data } = await apiClient.post<{ message: string }>(
    "/forgot-password",
    payload
  )
  return data
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const { data } = await apiClient.post<{ message: string }>(
    "/reset-password",
    payload
  )
  return data
}
