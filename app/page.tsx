import { Link002 } from "@/components/ui/cssLinkButton"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import Navbar from "@/components/ui/navbar"
import WaterRipple from "@/components/ui/water-ripple"
import Link from "next/link"

export default function Page() {
  return (
    <WaterRipple
      rainIntensity={0.2}
      className="h-screen w-full"
      resolution={256}
      dropRadius={40}
      perturbance={1}
      interactive={true}
      textConfig={{
        lines: ["Abhedya"],
        fontSize: 250,
        color: "rgba(255,255,255,0.25)",
        fontWeight: "1000",
      }}
      backgroundColor="#FF7500"
    >
      <Navbar />
      <div className="fixed right-0 bottom-0 left-0 flex items-center justify-between px-6 py-6 md:px-12">
        <h1 className="max-w-xl text-3xl leading-tight font-semibold text-white md:text-3xl">
          Leverage AI to grow valuable skills through immersive realistic role
          play scenarios
        </h1>
        <div className="flex items-center gap-6">
          <InteractiveHoverButton className="border-white bg-transparent text-sm">
            <Link href={"/game"}>Try now</Link>
          </InteractiveHoverButton>
          <Link002
            className="text-md font-medium text-white opacity-90 hover:opacity-100"
            href="/"
          >
            Log In
          </Link002>
        </div>
      </div>
    </WaterRipple>
  )
}
