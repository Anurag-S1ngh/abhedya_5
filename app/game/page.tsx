"use client"

import Navbar from "@/components/ui/navbar"
import { ArrowRight, Check, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { parseMarkdown } from "./parseMarkdown"

// ── Sample questions ──────────────────────────────────────────────────────────
const questions = [
  {
    id: 1,
    text: "What does **HTTP** stand for? Explain in your own words.",
    media: null,
  },
  {
    id: 2,
    text: "Listen to the audio clip and describe what you hear.\n\n*Tip: focus on tone and pacing.*",
    media: { type: "audio" as const, src: "/sample.mp3" },
  },
  {
    id: 3,
    text: "Look at the image below and answer:\n\n**What design principle is being demonstrated?**",
    media: {
      type: "image" as const,
      src: "https://placehold.co/800x400/FF7500/ffffff?text=Question+Image",
    },
  },
  {
    id: 4,
    text: "Watch the video and summarise the key points in `3 bullet points`.",
    media: { type: "video" as const, src: "/sample.mp4" },
  },
]

export default function GamePage() {
  const [current, setCurrent] = useState(0)
  const [answer, setAnswer] = useState("")

  const q = questions[current]
  const total = questions.length

  function go(next: number) {
    setCurrent(next)
    setAnswer("")
  }

  function handleSubmit() {
    if (!answer.trim()) {
      toast.error("Please enter an answer before submitting.")
      return
    }
    // TODO: wire to backend — simulate correct/wrong for now
    const isCorrect = Math.random() > 0.5
    if (isCorrect) {
      toast.success("Correct! Well done.")
    } else {
      toast.error("Wrong answer. Try again!")
    }
    if (current < total - 1) go(current + 1)
  }

  // keyboard shortcut: Ctrl+Enter to submit
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSubmit()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [answer, current])

  return (
    <div className="flex min-h-screen flex-col bg-[#FDECC8] text-[#1A1A1A]">
      <Navbar dark />

      <div className="flex w-full flex-1 flex-col px-6 py-8 sm:py-14">
        {/* Question counter */}
        <div className="mb-8 flex items-center justify-between sm:mb-12">
          <h2 className="text-2xl font-black tracking-tight text-[#FF7500] uppercase sm:text-4xl md:text-5xl">
            Question {current + 1}
          </h2>
        </div>

        {/* Question card */}
        <div className="flex flex-1 flex-col gap-5 sm:gap-6">
          {/* Question text */}
          <div
            className="prose max-w-none text-base leading-relaxed text-[#1A1A1A] sm:text-lg md:text-xl"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(q.text) }}
          />

          {/* Media */}
          {q.media?.type === "image" && (
            <img
              src={q.media.src}
              alt="Question media"
              className="w-full rounded-lg object-cover"
              style={{ maxHeight: 360 }}
            />
          )}
          {q.media?.type === "video" && (
            <video
              src={q.media.src}
              controls
              className="w-full rounded-lg"
              style={{ maxHeight: 360 }}
            />
          )}
          {q.media?.type === "audio" && (
            <audio src={q.media.src} controls className="w-full rounded-lg" />
          )}

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
              title={current < total - 1 ? "Submit & Next" : "Submit"}
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FF7500] text-[#FDECC8] transition hover:bg-[#e86a00] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {current < total - 1 ? (
                <ArrowRight size={18} />
              ) : (
                <Check size={18} />
              )}
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
