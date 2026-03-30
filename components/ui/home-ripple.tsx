"use client"

import WaterRipple from "@/components/ui/water-ripple"
import { useEffect, useState } from "react"

export default function HomeRipple({
  children,
}: {
  children: React.ReactNode
}) {
  const [fontSize, setFontSize] = useState(180)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const updateSize = () => {
      setFontSize(Math.max(36, Math.min(window.innerWidth * 0.1, 200)))
      setIsMobile(window.innerWidth < 640)
    }

    updateSize()

    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  return (
    <WaterRipple
      shininess={isMobile ? 1.2 : 2}
      rainDrops={isMobile ? 0.1 : 1}
      rainIntensity={isMobile ? 0.09 : 0.1}
      className="min-h-screen w-full after:pointer-events-none"
      resolution={256}
      dropRadius={isMobile ? 38 : 55}
      perturbance={isMobile ? 1.35 : 3}
      interactive={true}
      tiltStrength={isMobile ? 2 : 10}
      grainStrength={0.1}
      textConfig={{
        lines: ["ABHEDYA 5.0"],
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
