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

export async function signup(payload: SignupPayload) {
  const { data } = await apiClient.post<{ message: string }>("/signup", payload)
  return data
}

export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post<{ message: string }>("/login", payload)
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
