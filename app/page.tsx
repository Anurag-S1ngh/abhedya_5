import HomeRipple from "@/components/ui/home-ripple"
import Navbar from "@/components/ui/navbar"
import { SmoothCursor } from "@/components/ui/smooth-cursor"
import StairsPreloader from "@/components/ui/stairs-preloader"
import Link from "next/link"

export default function Page() {
  return (
    <>
      <SmoothCursor
        springConfig={{
          damping: 45,
          stiffness: 40000,
          mass: 1,
          restDelta: 0.001,
        }}
      />
      <StairsPreloader
        columns={8}
        duration={1000}
        overlayHoldDuration={0}
        color="#88B7BD"
      />
      <HomeRipple>
        <Navbar />

        <div className="fixed right-4 bottom-24 z-30 sm:right-6 sm:bottom-8">
          <Link
            href="/game"
            className="rounded-full border border-[#FDECC8]/80 bg-black/55 px-8 py-3 text-base font-semibold tracking-wide text-[#FDECC8] backdrop-blur-sm transition hover:scale-105 hover:bg-black/70 sm:text-lg"
          >
            Start Game
          </Link>
        </div>

        {/* Bottom bar */}
        <div className="fixed right-0 bottom-0 left-0 px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-xl text-lg leading-tight font-semibold tracking-tight text-[#FDECC8]/80 sm:max-w-2xl sm:text-3xl">
              Decrypt ancient signs to expose hidden layers inside immersive
              puzzle driven hunt worlds
            </p>
          </div>
        </div>
      </HomeRipple>
    </>
  )
}
