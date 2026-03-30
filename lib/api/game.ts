import { apiClient } from "./client"

export interface QuestionResponse {
  questionNumber: number
  question: string
  imgSrc?: string
  message: string
}

export interface SubmitAnswerPayload {
  answer: string
  question_number: number
}

export async function getCurrentQuestion() {
  const { data } = await apiClient.get<QuestionResponse>("/user/question")
  return data
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
