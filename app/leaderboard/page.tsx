"use client"

import Countdown from "@/components/ui/countdown"
import Navbar from "@/components/ui/navbar"
import { useEffect, useState } from "react"
import {
  getApiErrorMessage,
  getLeaderboard,
  type LeaderboardUser,
} from "@/lib/api"

const GAME_START = new Date(
  process.env.NEXT_PUBLIC_GAME_START ?? "2026-04-01T22:00:00+05:30"
)

function getInitials(username: string) {
  return username
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

const RANK_STYLES = [
  { bar: "#FF7500", text: "#FF7500", glow: "rgba(255,117,0,0.25)" },   // 1st – orange
  { bar: "#2d7479", text: "#2d7479", glow: "rgba(45,116,121,0.2)" },   // 2nd
  { bar: "#3da6ab", text: "#3da6ab", glow: "rgba(61,166,171,0.18)" },  // 3rd
]

function rankStyle(rank: number) {
  return RANK_STYLES[rank - 1] ?? { bar: "#255f63", text: "#255f63", glow: "transparent" }
}

export default function LeaderboardPage() {
  const [animated, setAnimated] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [players, setPlayers] = useState<LeaderboardUser[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    setStartTime(GAME_START)
    if (GAME_START <= new Date()) setGameStarted(true)
  }, [])

  useEffect(() => {
    if (!gameStarted) return
    async function load() {
      try {
        const res = await getLeaderboard()
        setPlayers(res.users)
      } catch (err) {
        setError(getApiErrorMessage(err, "Failed to load leaderboard."))
      }
    }
    load()
  }, [gameStarted])

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
    return <Countdown target={startTime} onComplete={() => setGameStarted(true)} />
  }

  const maxQuestion = players[0]?.current_question ?? 1

  return (
    <div className="min-h-screen bg-[#88B7BD]">
      <Navbar dark />

      {/* Subtle grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#0a0a0a 1px, transparent 1px), linear-gradient(90deg, #0a0a0a 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full px-6 py-8 sm:py-12">

        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF7500] animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#0a0a0a]/50 uppercase">Live standings</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight uppercase text-[#0a0a0a] sm:text-7xl">
            Leader<span className="text-[#FF7500]">board</span>
          </h1>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 font-mono text-xs text-[#0a0a0a]/70">
            Error: {error}
          </div>
        ) : players.length === 0 ? (
          <div className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-ping rounded-full bg-[#FF7500]" />
            <span className="font-mono text-xs text-[#0a0a0a]/40">Fetching data…</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">

            {/* Column headers */}
            <div className="mb-1 grid grid-cols-[32px_48px_1fr_120px] items-center gap-3 px-1 sm:grid-cols-[32px_64px_1fr_160px]">
              <span className="font-mono text-[9px] tracking-widest text-[#0a0a0a]/35 uppercase">#</span>
              <span className="font-mono text-[9px] tracking-widest text-[#0a0a0a]/35 uppercase">Qn</span>
              <span className="font-mono text-[9px] tracking-widest text-[#0a0a0a]/35 uppercase">Progress</span>
              <span className="font-mono text-[9px] tracking-widest text-[#0a0a0a]/35 uppercase">Player</span>
            </div>

            {players.map((p, i) => {
              const rank = i + 1
              const style = rankStyle(rank)
              const pct = maxQuestion > 0 ? (p.current_question / maxQuestion) * 100 : 0
              const delay = i * 70

              return (
                <div
                  key={p.id}
                  className="group grid grid-cols-[32px_48px_1fr_120px] items-center gap-3 rounded-xl border border-[#0a0a0a]/8 bg-white/15 px-3 py-3 backdrop-blur-sm transition-all hover:bg-white/25 sm:grid-cols-[32px_64px_1fr_160px] sm:px-4 sm:py-3.5"
                  style={{
                    boxShadow: rank <= 3 ? `0 0 0 1px ${style.bar}22` : undefined,
                  }}
                >
                  {/* Rank */}
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-black"
                    style={{
                      background: `${style.bar}22`,
                      color: style.bar,
                      border: `1px solid ${style.bar}44`,
                    }}
                  >
                    {rank}
                  </span>

                  {/* Q number */}
                  <span
                    className="font-mono text-xs font-bold tabular-nums sm:text-sm"
                    style={{ color: style.text }}
                  >
                    Q{p.current_question}
                  </span>

                  {/* Bar track */}
                  <div className="relative h-6 overflow-hidden rounded-md bg-[#0a0a0a]/8">
                    {/* Fill */}
                    <div
                      className="absolute inset-y-0 left-0 rounded-md transition-all duration-700 ease-out"
                      style={{
                        width: animated ? `${pct}%` : "0%",
                        background: `linear-gradient(90deg, ${style.bar}99, ${style.bar})`,
                        transitionDelay: `${delay}ms`,
                      }}
                    />
                    {/* Avatar tip */}
                    <div
                      className="absolute top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[9px] font-black text-white shadow-sm transition-all duration-700 ease-out"
                      style={{
                        left: animated ? `clamp(12px, ${pct}%, calc(100% - 12px))` : "12px",
                        background: style.bar,
                        transitionDelay: `${delay}ms`,
                        boxShadow: `0 0 8px ${style.glow}`,
                      }}
                    >
                      {getInitials(p.username)}
                    </div>
                  </div>

                  {/* Name */}
                  <span className="truncate font-mono text-xs font-semibold text-[#0a0a0a]/70 sm:text-sm">
                    {p.username}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}