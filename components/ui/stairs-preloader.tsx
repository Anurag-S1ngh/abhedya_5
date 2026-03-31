"use client"

import { ReactNode, useEffect, useState } from "react"
import { InfinityLoader } from "@/components/ui/loader-13"

interface StairsPreloaderProps {
  columns?: number
  duration?: number // stairs exit duration in ms
  color?: string
  overlay?: ReactNode // blurs in then out between wave and stairs
  waveDuration?: number // how long the wave loader shows before overlay
  overlayHoldDuration?: number // how long overlay stays visible before blurring out
  onComplete?: () => void
}

// Timeline (defaults: waveDuration=1000, duration=1200, fadeDuration=600):
// 0ms                    — wave loader plays
// waveDuration           — overlay blurs in
// waveDuration+fade      — overlay blurs out
// waveDuration+fade*2    — stairs stagger-slide up
// ...+stairs done        — onComplete fires

type Phase = "wave" | "overlay-in" | "overlay-out" | "stairs"
type OverlayPhase = "idle" | "in" | "out"

export default function StairsPreloader({
  columns = 8,
  duration = 1200,
  color = "#88B7BD",
  overlay,
  waveDuration = 1000,
  overlayHoldDuration = 600,
  onComplete,
}: StairsPreloaderProps) {
  const [visible, setVisible] = useState(true)
  const [phase, setPhase] = useState<Phase>("wave")
  const [overlayPhase, setOverlayPhase] = useState<OverlayPhase>("idle")
  const [stairsAnimating, setStairsAnimating] = useState(false)

  const fadeDuration = duration / 2
  const staggerDelay = duration / columns / 2
  const slideDuration = duration / 2

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase("overlay-in")
      setTimeout(() => setOverlayPhase("in"), 30)
    }, waveDuration)

    const t2 = setTimeout(
      () => {
        setPhase("overlay-out")
        setOverlayPhase("out")
      },
      waveDuration + fadeDuration + overlayHoldDuration
    )

    const t3 = setTimeout(
      () => {
        setPhase("stairs")
        setStairsAnimating(true)
      },
      waveDuration + fadeDuration + overlayHoldDuration + fadeDuration
    )

    const t4 = setTimeout(
      () => {
        setVisible(false)
        onComplete?.()
      },
      waveDuration +
        fadeDuration +
        overlayHoldDuration +
        fadeDuration +
        (columns - 1) * staggerDelay +
        slideDuration +
        100
    )

    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [
    waveDuration,
    fadeDuration,
    overlayHoldDuration,
    columns,
    staggerDelay,
    slideDuration,
    onComplete,
  ])

  if (!visible) return null

  const showWave = phase === "wave"
  const showOverlay = phase === "overlay-in" || phase === "overlay-out"

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {/* Stairs — always rendered, slide up when stairsAnimating */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className="h-full flex-1"
            style={{
              backgroundColor: color,
              transform: stairsAnimating ? "scaleY(0)" : "scaleY(1)",
              transformOrigin: "top",
              transition: `transform ${slideDuration}ms cubic-bezier(0.76, 0, 0.24, 1)`,
              transitionDelay: stairsAnimating
                ? `${i * staggerDelay}ms`
                : "0ms",
            }}
          />
        ))}
      </div>

      {/* Infinity loader — shown during wave phase */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center"
        style={{
          opacity: showWave ? 1 : 0,
          transition: `opacity 300ms ease`,
        }}
      >
        <InfinityLoader
          size={64}
          className="stroke-[#FDECC8] [&_path]:stroke-[#FDECC8]"
        />
      </div>

      {/* Overlay: blurs in then out */}
      {overlay && showOverlay && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={{
            opacity: overlayPhase === "in" ? 1 : 0,
            filter: overlayPhase === "in" ? "blur(0px)" : "blur(16px)",
            transition: `opacity ${fadeDuration}ms ease, filter ${fadeDuration}ms ease`,
          }}
        >
          {overlay}
        </div>
      )}
    </div>
  )
}
