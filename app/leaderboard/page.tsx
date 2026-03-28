"use client"

import Navbar from "@/components/ui/navbar"
import { useEffect, useState } from "react"

const players = [
  { rank: 1, name: "Arjun Mehta", score: 976, avatar: "AM" },
  { rank: 2, name: "Priya Sharma", score: 936, avatar: "PS" },
  { rank: 3, name: "Rohan Das", score: 907, avatar: "RD" },
  { rank: 4, name: "Sneha Iyer", score: 874, avatar: "SI" },
  { rank: 5, name: "Vikram Nair", score: 839, avatar: "VN" },
  { rank: 6, name: "Ananya Bose", score: 791, avatar: "AB" },
  { rank: 7, name: "Karan Joshi", score: 745, avatar: "KJ" },
  { rank: 8, name: "Divya Pillai", score: 698, avatar: "DP" },
]

const MAX_SCORE = players[0].score

function maxWidth(rank: number) {
  return 100 - (rank - 1) * 3
}

function barColor(rank: number) {
  if (rank === 1) return "#FF7500"
  if (rank === 2) return "#FF9A3C"
  if (rank === 3) return "#FFB347"
  return "rgba(255,117,0,0.2)"
}

export default function LeaderboardPage() {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen bg-[#FDECC8] text-[#1A1A1A]">
      <Navbar dark />

      <div className="mx-auto w-full max-w-7xl py-8 sm:py-14">
        <h1 className="mb-10 text-5xl font-black tracking-tight uppercase sm:text-7xl">
          Leaderboard
        </h1>

        <div className="flex flex-col gap-3">
          {players.map((p, i) => {
            const widthPct = (p.score / MAX_SCORE) * maxWidth(p.rank)
            const delay = i * 80

            return (
              <div key={p.rank} className="flex items-center gap-4">
                <span className="w-20 shrink-0 text-sm font-semibold text-[#1A1A1A]/50 tabular-nums sm:text-base">
                  {p.score} p
                </span>

                <div
                  className="relative flex-1 overflow-visible"
                  style={{ height: 52 }}
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-sm transition-all duration-700 ease-out"
                    style={{
                      width: animated ? `${widthPct}%` : "0%",
                      backgroundColor: barColor(p.rank),
                      transitionDelay: `${delay}ms`,
                    }}
                  />
                  <div
                    className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-xs font-bold transition-all duration-700 ease-out sm:text-sm"
                    style={{
                      left: animated ? `${widthPct}%` : "0%",
                      transitionDelay: `${delay}ms`,
                      width: 52,
                      height: 52,
                      background:
                        p.rank <= 3
                          ? "linear-gradient(135deg, #FF7500, #e86a00)"
                          : "rgba(26,26,26,0.1)",
                      border:
                        p.rank === 1
                          ? "2px solid #FF7500"
                          : "2px solid rgba(26,26,26,0.15)",
                      zIndex: 10,
                    }}
                  >
                    {p.avatar}
                  </div>
                </div>

                <span className="w-32 shrink-0 text-sm font-semibold sm:w-44 sm:text-base">
                  {p.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
