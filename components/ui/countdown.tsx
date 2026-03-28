"use client"

import Navbar from "@/components/ui/navbar"
import { useEffect, useState } from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now())
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

function pad(n: number) {
  return String(n).padStart(2, "0")
}

interface CountdownProps {
  target: Date
  onComplete: () => void
}

export default function Countdown({ target, onComplete }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(target))

  useEffect(() => {
    const tick = () => {
      const t = getTimeLeft(target)
      setTimeLeft(t)
      if (t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0) {
        onComplete()
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target, onComplete])

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-[#FDECC8] text-[#1A1A1A]">
      <Navbar dark />
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-10 sm:gap-10 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-widest text-[#FF7500]/70 uppercase sm:text-sm">
            Game starts in
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[#FF7500] sm:text-5xl md:text-6xl">
            ABHEDYA
          </h1>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-6">
          {units.map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-[#FF7500]/20 bg-[#FF7500]/5 text-2xl font-black tabular-nums text-[#FF7500] sm:h-24 sm:w-24 sm:text-4xl md:h-32 md:w-32 md:text-5xl">
                {pad(value)}
              </div>
              <span className="text-[10px] font-semibold tracking-widest text-[#1A1A1A]/50 uppercase sm:text-xs">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
