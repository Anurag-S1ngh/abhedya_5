"use client"

import Countdown from "@/components/ui/countdown"
import Navbar from "@/components/ui/navbar"
import { useEffect, useState } from "react"
import {
  getApiErrorMessage,
  getLeaderboard,
  type LeaderboardUser,
} from "@/lib/api"

const BAR_COLORS = ["#000000"]

const HOVER_BAR_COLOR = "#ffffff"

function barColor(rank: number) {
  return BAR_COLORS[Math.min(rank - 1, BAR_COLORS.length - 1)]
}

const GAME_START = new Date(
  process.env.NEXT_PUBLIC_GAME_START ?? "2026-04-01T22:00:00+05:30"
)

export default function LeaderboardPage() {
  const [animated, setAnimated] = useState(false)
  const [hoveredPlayerId, setHoveredPlayerId] = useState<number | null>(null)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [players, setPlayers] = useState<LeaderboardUser[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 0)
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
        <div className="rounded-2xl border border-[#FDECC8]/10 bg-[#1a2e30]/40 px-4 py-6 shadow-[0_18px_45px_rgba(0,0,0,0.85)] backdrop-blur-sm sm:px-6 sm:py-8">
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
                const isHovered = hoveredPlayerId === p.id
                const color = isHovered ? HOVER_BAR_COLOR : barColor(rank)
                const markerTextColor = isHovered ? "#0a0a0a" : "#e8f5f6"
                const widthPct =
                  maxQuestion > 0 ? (p.current_question / maxQuestion) * 88 : 0
                const delay = i * 80
                const avatarSize = 40

                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all duration-300 ease-out sm:gap-4"
                    style={{
                      transform: isHovered
                        ? "translateY(-3px)"
                        : "translateY(0)",
                      boxShadow: isHovered
                        ? "0 10px 24px rgba(0, 0, 0, 0.35)"
                        : "0 0 0 rgba(0, 0, 0, 0)",
                    }}
                    onMouseEnter={() => setHoveredPlayerId(p.id)}
                    onMouseLeave={() => setHoveredPlayerId(null)}
                  >
                    {/* Rank square */}
                    <div
                      className="flex shrink-0 items-center justify-center rounded-sm text-xs font-black"
                      style={{
                        width: 28,
                        height: 28,
                        background: color,
                        color: markerTextColor,
                      }}
                    >
                      {rank}
                    </div>

                    {/* Current question */}
                    <span className="w-14 shrink-0 rounded-full border border-[#0f1f23]/35 bg-[#FDECC8] px-2 py-1 text-center text-xs font-black text-[#0f1f23] tabular-nums shadow-[0_4px_12px_rgba(0,0,0,0.25)] sm:w-20 sm:text-sm">
                      Q{p.current_question}
                    </span>

                    {/* Bar + avatar tip */}
                    <div
                      className="relative flex-1 overflow-visible"
                      style={{
                        height: avatarSize,
                        paddingRight: avatarSize / 2,
                      }}
                    >
                      <div
                        className="absolute inset-y-0 left-0 rounded-sm"
                        style={{
                          width: animated ? `${widthPct}%` : "0%",
                          backgroundColor: color,
                          transition: `width 700ms ease-out ${delay}ms, background-color 120ms ease-out`,
                        }}
                      />
                      <div
                        className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-bold"
                        style={{
                          left: animated ? `${widthPct}%` : "0%",
                          transition: `left 700ms ease-out ${delay}ms, background-color 120ms ease-out, color 120ms ease-out`,
                          width: avatarSize,
                          height: avatarSize,
                          background: color,
                          color: markerTextColor,
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
