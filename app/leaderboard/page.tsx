"use client"

import Countdown from "@/components/ui/countdown"
import Navbar from "@/components/ui/navbar"
import { useEffect, useState } from "react"
import {
  getApiErrorMessage,
  getLeaderboard,
  type LeaderboardUser,
} from "@/lib/api"

const BAR_COLORS = [
  "#1e4a4e",
  "#255f63",
  "#2d7479",
  "#358d92",
  "#3da6ab",
  "#4bbfc5",
  "#59d8de",
]

function barColor(rank: number) {
  return BAR_COLORS[Math.min(rank - 1, BAR_COLORS.length - 1)]
}

const GAME_START = new Date(
  process.env.NEXT_PUBLIC_GAME_START ?? "2026-04-01T22:00:00+05:30"
)

export default function LeaderboardPage() {
  const [animated, setAnimated] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [players, setPlayers] = useState<LeaderboardUser[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    setStartTime(GAME_START)
    if (GAME_START <= new Date()) {
      setGameStarted(true)
    }
  }, [])

  useEffect(() => {
    if (!gameStarted) return

    async function loadLeaderboard() {
      try {
        const response = await getLeaderboard()
        setPlayers(response.users)
      } catch (error) {
        setError(getApiErrorMessage(error, "Failed to load leaderboard."))
      }
    }

    loadLeaderboard()
  }, [gameStarted])

  if (!startTime) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#88B7BD]">
        <span className="text-sm text-[#FDECC8]/60">Loading…</span>
      </div>
    )
  }

  if (!gameStarted) {
    return (
      <Countdown target={startTime} onComplete={() => setGameStarted(true)} />
    )
  }

  const maxQuestion = players[0]?.current_question ?? 0

  function getInitials(username: string) {
    return username
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
  }

  return (
    <div className="min-h-screen bg-[#88B7BD] text-[#FDECC8]">
      <Navbar dark />

      <div className="w-full px-6 py-8 sm:py-14">
        <h1 className="mb-1 text-4xl font-black tracking-tight uppercase sm:text-6xl md:text-7xl">
          Leaderboard
        </h1>
        <p className="mb-8 text-xs font-semibold tracking-widest text-[#FDECC8]/70 uppercase sm:mb-10 sm:text-sm">
          Live standings
        </p>

        {/* Card */}
        <div className="rounded-2xl bg-[#1a2e30]/40 backdrop-blur-sm border border-[#FDECC8]/10 px-4 py-6 sm:px-6 sm:py-8">
          {error ? (
            <div className="rounded-sm border border-[#FDECC8]/20 bg-[#1a2e30]/40 px-4 py-3 text-sm text-[#FDECC8]">
              {error}
            </div>
          ) : players.length === 0 ? (
            <div className="text-sm text-[#FDECC8]/60">
              Loading leaderboard...
            </div>
          ) : (
            <div className="flex flex-col gap-2 sm:gap-3">
              {players.map((p, i) => {
                const rank = i + 1
                const color = barColor(rank)
                const widthPct =
                  maxQuestion > 0
                    ? (p.current_question / maxQuestion) * 88
                    : 0
                const delay = i * 80
                const avatarSize = 40

                return (
                  <div key={p.id} className="flex items-center gap-2 sm:gap-4">
                    {/* Rank square */}
                    <div
                      className="flex shrink-0 items-center justify-center rounded-sm text-xs font-black"
                      style={{
                        width: 28,
                        height: 28,
                        background: color,
                        color: "#e8f5f6",
                      }}
                    >
                      {rank}
                    </div>

                    {/* Current question */}
                    <span className="w-14 shrink-0 text-xs font-semibold text-[#FDECC8]/60 tabular-nums sm:w-20 sm:text-sm">
                      Q{p.current_question}
                    </span>

                    {/* Bar + avatar tip */}
                    <div
                      className="relative flex-1 overflow-visible"
                      style={{ height: avatarSize, paddingRight: avatarSize / 2 }}
                    >
                      <div
                        className="absolute inset-y-0 left-0 rounded-sm transition-all duration-700 ease-out"
                        style={{
                          width: animated ? `${widthPct}%` : "0%",
                          backgroundColor: color,
                          transitionDelay: `${delay}ms`,
                        }}
                      />
                      <div
                        className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-bold transition-all duration-700 ease-out"
                        style={{
                          left: animated ? `${widthPct}%` : "0%",
                          transitionDelay: `${delay}ms`,
                          width: avatarSize,
                          height: avatarSize,
                          background: color,
                          color: "#e8f5f6",
                          zIndex: 10,
                          fontSize: 11,
                        }}
                      >
                        {getInitials(p.username)}
                      </div>
                    </div>

                    {/* Name */}
                    <span className="ml-4 w-24 shrink-0 text-xs font-semibold text-[#FDECC8] sm:w-36 sm:text-sm md:w-44 md:text-base">
                      {p.username}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
