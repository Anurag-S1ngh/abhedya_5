"use client"

import WaterRipple from "@/components/ui/water-ripple"
import { useEffect, useState } from "react"

export default function HomeRipple({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState(220)

  useEffect(() => {
    const update = () => setFontSize(window.innerWidth < 640 ? 56 : 220)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return (
    <WaterRipple
      shininess={2}
      rainDrops={0.01}
      rainIntensity={0.2}
      className="h-screen w-full"
      resolution={256}
      dropRadius={55}
      perturbance={3}
      interactive={true}
      tiltStrength={10}
      textConfig={{
        lines: ["ABHEDYA"],
        fontSize,
        color: "#FDECC8",
        fontWeight: "1000",
      }}
      backgroundColor="#FF7500"
    >
      {children}
    </WaterRipple>
  )
}
