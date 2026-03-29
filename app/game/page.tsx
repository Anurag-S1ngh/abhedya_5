"use client"

import Countdown from "@/components/ui/countdown"
import Navbar from "@/components/ui/navbar"
import { ArrowRight, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import {
  getApiErrorMessage,
  getCurrentQuestion,
  submitAnswer,
  type QuestionResponse,
} from "@/lib/api"
import { parseMarkdown } from "./parseMarkdown"

const GAME_START = new Date(
  process.env.NEXT_PUBLIC_GAME_START ?? "2026-04-01T18:00:00+05:30"
)

export default function GamePage() {
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] =
    useState<QuestionResponse | null>(null)
  const [isQuestionLoading, setIsQuestionLoading] = useState(false)
  const [answer, setAnswer] = useState("")
  const router = useRouter()

  useEffect(() => {
    setStartTime(GAME_START)
    if (GAME_START <= new Date()) {
      setGameStarted(true)
    }
  }, [])

  const loadQuestion = useCallback(async () => {
    setIsQuestionLoading(true)

    try {
      const response = await getCurrentQuestion()
      setCurrentQuestion(response)
    } catch (error) {
      const message = getApiErrorMessage(error, "Failed to load your question.")
      toast.error(message)

      if (message.toLowerCase().includes("unauthorized")) {
        router.push("/signin")
      }
    } finally {
      setIsQuestionLoading(false)
    }
  }, [router])

  const handleComplete = useCallback(() => setGameStarted(true), [])

  useEffect(() => {
    if (!gameStarted) {
      return
    }

    loadQuestion()
  }, [gameStarted, loadQuestion])

  async function handleSubmit() {
    if (!answer.trim()) {
      toast.error("Please enter an answer before submitting.")
      return
    }

    if (!currentQuestion) {
      toast.error("Question not loaded yet.")
      return
    }

    try {
      await submitAnswer({
        answer: answer.trim(),
        question_number: currentQuestion.questionNumber,
      })
      toast.success("Correct! Loading next question.")
      setAnswer("")
      await loadQuestion()
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Wrong answer. Try again!"))
    }
  }

  // keyboard shortcut: Ctrl+Enter to submit
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSubmit()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [answer, currentQuestion])

  // Loading state
  if (!startTime) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDECC8]">
        <span className="text-sm text-[#FF7500]/60">Loading…</span>
      </div>
    )
  }

  // Countdown state
  if (!gameStarted) {
    return <Countdown target={startTime} onComplete={handleComplete} />
  }

  if (isQuestionLoading && !currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDECC8]">
        <span className="text-sm text-[#FF7500]/60">Loading question...</span>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDECC8]">
        <span className="text-sm text-[#FF7500]/60">
          Unable to load your current question.
        </span>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FDECC8] text-[#1A1A1A]">
      <Navbar dark />

      <div className="flex w-full flex-1 flex-col px-6 py-8 sm:py-14">
        {/* Question counter */}
        <div className="mb-8 flex items-center justify-between sm:mb-12">
          <h2 className="text-2xl font-black tracking-tight text-[#FF7500] uppercase sm:text-4xl md:text-5xl">
            Question {currentQuestion.questionNumber}
          </h2>
        </div>

        {/* Question card */}
        <div className="flex flex-1 flex-col gap-5 sm:gap-6">
          {/* Question text */}
          <div
            className="prose max-w-none text-base leading-relaxed text-[#1A1A1A] sm:text-lg md:text-xl"
            dangerouslySetInnerHTML={{
              __html: parseMarkdown(currentQuestion.question),
            }}
          />

          {/* Answer input */}
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here…"
            className="w-full rounded-lg border border-[#1A1A1A]/20 bg-[#1A1A1A]/5 px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/30 transition outline-none focus:border-[#FF7500]/60 focus:ring-1 focus:ring-[#FF7500]/30 sm:px-5 sm:py-4 sm:text-base"
          />

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={!answer.trim()}
              title="Submit answer"
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FF7500] text-[#FDECC8] transition hover:bg-[#e86a00] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => setAnswer("")}
              title="Clear"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#1A1A1A]/20 text-[#1A1A1A]/50 transition hover:border-[#1A1A1A]/40 hover:text-[#1A1A1A]/80"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
