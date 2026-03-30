import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import HomeRipple from "@/components/ui/home-ripple"
import Navbar from "@/components/ui/navbar"
import { SmoothCursor } from "@/components/ui/smooth-cursor"
import StairsPreloader from "@/components/ui/stairs-preloader"

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
        color="#FDECC8"
      />
      <HomeRipple>
        <Navbar />

        {/* Bottom bar */}
        <div className="fixed right-0 bottom-0 left-0 px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-xl text-xl leading-tight font-semibold tracking-tight text-[#FDECC8]/80 sm:max-w-2xl sm:text-4xl">
              Decrypt ancient signs to expose hidden layers inside immersive
              puzzle driven hunt worlds
            </p>
          </div>
        </div>
      </HomeRipple>
    </>
  )
}
