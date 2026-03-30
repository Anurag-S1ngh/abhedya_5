"use client"

import WaterRipple from "@/components/ui/water-ripple"
import { useEffect, useState } from "react"

export default function HomeRipple({
  children,
}: {
  children: React.ReactNode
}) {
  const [fontSize, setFontSize] = useState(220)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth
      const mobile = width < 640
      setIsMobile(mobile)
      setFontSize(mobile ? Math.max(34, Math.min(50, width * 0.12)) : 220)
    }

    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return (
    <WaterRipple
      shininess={isMobile ? 1.2 : 2}
      rainDrops={isMobile ? 0.003 : 0.01}
      rainIntensity={isMobile ? 0.035 : 0.1}
      className="min-h-screen w-full"
      resolution={isMobile ? 192 : 256}
      dropRadius={isMobile ? 38 : 55}
      perturbance={isMobile ? 1.35 : 3}
      interactive={true}
      tiltStrength={isMobile ? 2 : 10}
      grainStrength={0.1}
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
