"use client"

import Countdown from "@/components/ui/countdown"
import Navbar from "@/components/ui/navbar"
import { ArrowRight, X, Terminal, Zap } from "lucide-react"
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

const GAME_START = new Date(
  process.env.NEXT_PUBLIC_GAME_START ?? "2026-04-01T22:00:00+05:30"
)

export default function GamePage() {
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [authRequired, setAuthRequired] = useState(false)
  const [currentQuestion, setCurrentQuestion] =
    useState<QuestionResponse | null>(null)
  const [isQuestionLoading, setIsQuestionLoading] = useState(false)
  const [answer, setAnswer] = useState("")
  const [focused, setFocused] = useState(false)
  const [submitting, setSubmitting] = useState(false)

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
          if (axios.isAxiosError(retryError) && retryError.response?.status === 401) {
            setCurrentQuestion(null)
            setAuthRequired(true)
            return
          }
          toast.error(getApiErrorMessage(retryError, "Failed to load your question."))
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
    if (!gameStarted) return
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
    setSubmitting(true)
    try {
      await submitAnswer({ answer, question_number: currentQuestion.questionNumber })
      toast.success("Correct! Loading next question.")
      setAnswer("")
      await loadQuestion()
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Wrong answer. Try again!"))
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSubmit()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [answer, currentQuestion])

  if (!startTime) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#88B7BD]">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 animate-ping rounded-full bg-[#FF7500]" />
          <span className="font-mono text-xs tracking-widest text-[#0a0a0a]/50 uppercase">Initializing</span>
        </div>
      </div>
    )
  }

  if (!gameStarted) {
    return <Countdown target={startTime} onComplete={handleComplete} />
  }

  if (isQuestionLoading && !currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#88B7BD]">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 animate-ping rounded-full bg-[#FF7500]" />
          <span className="font-mono text-xs tracking-widest text-[#0a0a0a]/50 uppercase">Loading question</span>
        </div>
      </div>
    )
  }

  if (authRequired) {
    return (
      <div className="flex min-h-screen flex-col bg-[#88B7BD]">
        <Navbar dark />
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="w-full max-w-sm">
            {/* Glitchy border card */}
            <div className="relative rounded-2xl border border-[#0a0a0a]/10 bg-[#0a0a0a]/5 p-8 backdrop-blur-sm">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF7500] to-transparent" />
              <div className="mb-1 flex items-center gap-2">
                <span className="font-mono text-xs text-[#FF7500] tracking-widest uppercase">401</span>
                <span className="h-px flex-1 bg-[#FF7500]/20" />
              </div>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-[#0a0a0a] uppercase sm:text-4xl">
                Auth Required
              </h1>
              <p className="mt-2 text-sm text-[#0a0a0a]/55 leading-relaxed">
                The hunt is live. Sign in to access your current question.
              </p>
              <Link
                href="/signin"
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#FF7500] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e06500] active:scale-[0.98]"
              >
                Sign In
                <ArrowRight size={15} />
              </Link>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#FF7500]/30 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#88B7BD]">
        <span className="font-mono text-xs text-[#0a0a0a]/40">Unable to load question</span>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#88B7BD]">
      <Navbar dark />

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(#0a0a0a 1px, transparent 1px), linear-gradient(90deg, #0a0a0a 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative flex w-full flex-1 flex-col px-6 py-8 sm:py-12">

        {/* Header strip */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF7500] animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.2em] text-[#0a0a0a]/50 uppercase">Active</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight text-[#0a0a0a] uppercase sm:text-6xl">
              Q<span className="text-[#FF7500]">{String(currentQuestion.questionNumber).padStart(2, "0")}</span>
            </h2>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs text-[#0a0a0a]/40 tracking-widest">CTRL+ENTER to submit</span>
          </div>
        </div>

        {/* Main card */}
        <div className="relative flex flex-1 flex-col rounded-2xl border border-[#0a0a0a]/10 bg-white/20 p-6 backdrop-blur-md sm:p-8 gap-6">
          <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-white/60 to-transparent" />

          {/* Corner accent */}
          <div className="absolute right-6 top-6">
            <Terminal size={16} className="text-[#0a0a0a]/20" />
          </div>

          {/* Question text */}
          <div
            className="text-base leading-relaxed text-[#0a0a0a]/80 sm:text-lg"
            dangerouslySetInnerHTML={{
              __html: currentQuestion.question.replace(/\n/g, "<br/>"),
            }}
          />

          {currentQuestion.imgSrc && (
            <div className="w-fit overflow-hidden rounded-xl border border-[#0a0a0a]/10 bg-[#0a0a0a]/5">
              <img
                src={currentQuestion.imgSrc}
                alt={`Question ${currentQuestion.questionNumber}`}
                className="block h-auto max-h-96 w-auto max-w-full object-contain"
              />
            </div>
          )}

          {/* Input area */}
          <div className="mt-auto flex flex-col gap-3">
            <div
              className={`relative flex items-center rounded-xl border transition-all duration-200 ${focused
                  ? "border-[#FF7500]/60 bg-white/50 shadow-[0_0_0_3px_rgba(255,117,0,0.12)]"
                  : "border-[#0a0a0a]/15 bg-white/30"
                }`}
            >
              <span className="pointer-events-none pl-4 font-mono text-sm text-[#FF7500]/70">&gt;</span>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Enter your answer…"
                className="flex-1 bg-transparent px-3 py-3.5 text-sm text-[#0a0a0a] placeholder-[#0a0a0a]/35 outline-none sm:py-4 sm:text-base"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSubmit}
                disabled={!answer.trim() || submitting}
                className="flex items-center gap-2 rounded-xl bg-[#FF7500] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e06500] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? (
                  <>
                    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Checking
                  </>
                ) : (
                  <>
                    Submit
                    <Zap size={14} />
                  </>
                )}
              </button>
              <button
                onClick={() => setAnswer("")}
                title="Clear"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#0a0a0a]/15 text-[#0a0a0a]/40 transition hover:border-[#0a0a0a]/30 hover:text-[#0a0a0a]/70"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
