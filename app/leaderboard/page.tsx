"use client"

import Navbar from "@/components/ui/navbar"
import { useEffect, useState } from "react"

const players = [
  { rank: 1, name: "Arjun Mehta", score: 1000, avatar: "" },
  { rank: 2, name: "Priya Sharma", score: 936, avatar: "" },
  { rank: 3, name: "Rohan Das", score: 907, avatar: "RD" },
  { rank: 4, name: "Sneha Iyer", score: 874, avatar: "SI" },
  { rank: 5, name: "Vikram Nair", score: 839, avatar: "VN" },
  { rank: 6, name: "Ananya Bose", score: 791, avatar: "AB" },
]

const MAX_SCORE = players[0].score

function maxWidth(rank: number) {
  return 100 - (rank - 1) * 3
}

function barColor(rank: number) {
  if (rank === 1) return "#FF7500"
  if (rank === 2) return "#FF9A3C"
  if (rank === 3) return "#FFB347"
  return "#F8D7AD"
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

      <div className="w-full px-6 py-8 sm:py-14">
        <h1 className="mb-1 text-4xl font-black tracking-tight uppercase sm:text-6xl md:text-7xl">
          Leaderboard
        </h1>
        <p className="mb-8 text-xs font-medium tracking-widest text-[#FF7500] uppercase sm:mb-10 sm:text-sm">
          Your rank: #4
        </p>

        <div className="flex flex-col gap-2 sm:gap-3">
          {players.map((p, i) => {
            const widthPct = (p.score / MAX_SCORE) * maxWidth(p.rank)
            const delay = i * 80
            const avatarSize = 40

            return (
              <div key={p.rank} className="flex items-center gap-2 sm:gap-4">
                {/* Rank square */}
                <div
                  className="flex shrink-0 items-center justify-center rounded-sm text-xs font-black"
                  style={{
                    width: 28,
                    height: 28,
                    background:
                      p.rank <= 3 ? "#FF7500" : "rgba(255,117,0,0.12)",
                    color: p.rank <= 3 ? "#FDECC8" : "#FF7500",
                  }}
                >
                  {p.rank}
                </div>

                {/* Score */}
                <span className="w-14 shrink-0 text-xs font-semibold text-[#1A1A1A]/50 tabular-nums sm:w-20 sm:text-sm">
                  {p.score}p
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
                      backgroundColor: barColor(p.rank),
                      transitionDelay: `${delay}ms`,
                    }}
                  />
                  <div
                    className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-xs font-bold transition-all duration-700 ease-out"
                    style={{
                      left: animated ? `${widthPct}%` : "0%",
                      transitionDelay: `${delay}ms`,
                      width: avatarSize,
                      height: avatarSize,
                      background: barColor(p.rank),
                      zIndex: 10,
                      fontSize: 11,
                    }}
                  ></div>
                </div>

                {/* Name */}
                <span className="ml-4 w-24 shrink-0 text-xs font-semibold sm:w-36 sm:text-sm md:w-44 md:text-base">
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
