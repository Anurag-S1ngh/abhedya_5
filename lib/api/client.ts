import axios from "axios"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://prody.nith.ac.in/abhedya/api"
const FRONTEND_BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.NODE_ENV === "production" ? "/abhedya" : "")

export const apiClient = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
})

export function withBasePath(path: string) {
  if (!FRONTEND_BASE_PATH) {
    return path
  }

  if (!path.startsWith("/")) {
    return `${FRONTEND_BASE_PATH}/${path}`
  }

  return `${FRONTEND_BASE_PATH}${path}`
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong."
) {
  if (axios.isAxiosError(error)) {
    const message =
      typeof error.response?.data?.error === "string"
        ? error.response.data.error
        : typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : error.message

    if (message) {
      return message
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}
