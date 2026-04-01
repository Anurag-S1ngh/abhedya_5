import { apiClient } from "./client"

export interface QuestionResponse {
  questionNumber: number
  question: string
  imgSrc?: string
  message: string
}

interface RawQuestionResponse {
  questionNumber?: number
  question_number?: number
  question: string
  imgSrc?: string
  img_src?: string
  message: string
}

function resolveImageSrc(src?: string) {
  if (!src) {
    return undefined
  }

  const trimmed = src.trim()
  if (!trimmed) {
    return undefined
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed
  }

  const baseURL = apiClient.defaults.baseURL
  if (!baseURL) {
    return trimmed
  }

  const normalizedBase = baseURL.replace(/\/$/, "")
  const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`
  return `${normalizedBase}${normalizedPath}`
}

export interface SubmitAnswerPayload {
  answer: string
  question_number: number
}

export async function getCurrentQuestion() {
  const { data } = await apiClient.get<RawQuestionResponse>("/user/question")

  return {
    questionNumber: data.questionNumber ?? data.question_number ?? 0,
    question: data.question,
    imgSrc: resolveImageSrc(data.imgSrc ?? data.img_src),
    message: data.message,
  }
}

export async function submitAnswer(payload: SubmitAnswerPayload) {
  const normalizedPayload = {
    ...payload,
    answer: payload.answer.toLowerCase().replace(/\s+/g, ""),
  }

  const { data } = await apiClient.post<{ message: string }>(
    "/user/submit-answer",
    normalizedPayload
  )
  return data
}
