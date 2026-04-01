"use client"

import Countdown from "@/components/ui/countdown"
import Navbar from "@/components/ui/navbar"
import { ArrowRight, X } from "lucide-react"
import axios from "axios"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import {
  getApiErrorMessage,
  getCurrentQuestion,
  submitAnswer,
  type QuestionResponse,
} from "@/lib/api"
import { parseMarkdown } from "./parseMarkdown"
//process.env.NEXT_PUBLIC_GAME_START ??
const GAME_START = new Date(
   "2026-03-01T22:00:00+05:30"
)

export default function GamePage() {
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [authRequired, setAuthRequired] = useState(false)
  const [currentQuestion, setCurrentQuestion] =
    useState<QuestionResponse | null>(null)
  const [isQuestionLoading, setIsQuestionLoading] = useState(false)
  const [answer, setAnswer] = useState("")

  useEffect(() => {
    setStartTime(GAME_START)
    if (GAME_START <= new Date()) {
      setGameStarted(true)
    }
  }, [])

  const loadQuestion = useCallback(async () => {
    setIsQuestionLoading(true)
    setAuthRequired(false)

    try {
      const response = await getCurrentQuestion()
      setAuthRequired(false)
      setCurrentQuestion(response)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        await new Promise((resolve) => window.setTimeout(resolve, 300))

        try {
          const retryResponse = await getCurrentQuestion()
          setAuthRequired(false)
          setCurrentQuestion(retryResponse)
          return
        } catch (retryError) {
          if (
            axios.isAxiosError(retryError) &&
            retryError.response?.status === 401
          ) {
            setCurrentQuestion(null)
            setAuthRequired(true)
            return
          }

          toast.error(
            getApiErrorMessage(retryError, "Failed to load your question.")
          )
          return
        }
      }

      const message = getApiErrorMessage(error, "Failed to load your question.")

      if (message.toLowerCase().includes("unauthorized")) {
        setCurrentQuestion(null)
        setAuthRequired(true)
        return
      }

      toast.error(message)
    } finally {
      setIsQuestionLoading(false)
    }
  }, [])

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
        answer,
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
      <div className="flex min-h-screen items-center justify-center bg-[#88B7BD]">
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
      <div className="flex min-h-screen items-center justify-center bg-[#88B7BD]">
        <span className="text-sm text-[#0a0a0a]">Loading question...</span>
      </div>
    )
  }

  if (authRequired) {
    return (
      <div className="flex min-h-screen flex-col bg-[#88B7BD] text-[#FDECC8]">
        <Navbar dark />
        <div className="flex flex-1 items-center justify-center px-6 py-8 sm:py-14">
          <div className="max-w-md text-center">
            <h1 className="text-3xl font-black tracking-tight text-[#FF7500] uppercase sm:text-5xl">
              Please Login First
            </h1>
            <p className="mt-3 text-sm text-[#FDECC8]/65 sm:text-base">
              The hunt is live. Sign in to access your current question and
              start playing.
            </p>
            <Link
              href="/signin"
              className="mt-6 inline-flex rounded-lg bg-[#FF7500] px-5 py-3 text-sm font-semibold text-[#FDECC8] transition hover:bg-[#e86a00]"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#88B7BD]">
        <span className="text-sm text-[#FF7500]/60">
          Unable to load your current question.
        </span>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#88B7BD] text-[#FDECC8]">
      <Navbar dark />

      <div className="flex w-full flex-1 flex-col px-6 py-8 sm:py-14">
        {/* Question counter */}
        <div className="mb-8 flex items-center justify-between sm:mb-12">
          <h2 className="text-2xl font-black tracking-tight text-[#0a0a0a] uppercase sm:text-4xl md:text-5xl">
            Question {currentQuestion.questionNumber}
          </h2>
        </div>

        {/* Question card */}
        <div className="flex flex-1 flex-col gap-5 sm:gap-6">
          {/* Question text */}
          <div
            className="prose max-w-none text-base leading-relaxed text-[#0a0a0a] sm:text-lg md:text-xl"
            dangerouslySetInnerHTML={{
              __html: currentQuestion.question.replace(/\n/g, "<br/>"),
            }}
          />

          {currentQuestion.imgSrc ? (
            <div className="w-fit max-w-full rounded-lg border border-[#FDECC8]/10 bg-[#111111] p-2">
              <img
                src={currentQuestion.imgSrc}
                alt={`Question ${currentQuestion.questionNumber}`}
                className="block h-auto max-h-105 w-auto max-w-full rounded-md object-contain"
              />
            </div>
          ) : null}

          {/* Answer input */}
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here…"
            className="w-full rounded-lg border border-[#FDECC8]/15 bg-[#FDECC8] px-4 py-3 text-sm text-[#0a0a0a] placeholder-[#0a0a0a]/45 transition outline-none focus:border-[#0a0a0a]/35 focus:ring-1 focus:ring-[#0a0a0a]/20 sm:px-5 sm:py-4 sm:text-base"
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
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#FDECC8]/15 text-[#FDECC8]/50 transition hover:border-[#FDECC8]/35 hover:text-[#FDECC8]/80"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
