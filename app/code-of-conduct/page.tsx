import Navbar from "@/components/ui/navbar"

const whatsappGroupUrl =
  "https://chat.whatsapp.com/LIpjcMwREMy59h3ggY42DG?mode=gi_t"

const conductPoints = [
  "Uniform scoring applies to every stage of the challenge. However, if there is a tie then time is the final tiebreaker.",
  "The first three contestants to solve the final riddle will secure the top positions, it offers an exclusive reserved prize pool for first years.",
  "Any participant found engaging in unfair practices or misconduct will be immediately disqualified.",
  "All official changes and updates will be communicated through the official channels of ISTE NITH (Abhedya Participants Whatsapp Group). Participants are responsible for staying informed.",
  "In case of any dispute, the organizing committee will have the sole authority to make the final and binding decision.",
]

export default function CodeOfConductPage() {
  return (
    <div className="min-h-screen bg-[#88B7BD]">
      <Navbar dark />

      {/* Subtle dot grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#0a0a0a 1px, transparent 1px), linear-gradient(90deg, #0a0a0a 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <main className="relative mx-auto w-full max-w-3xl px-6 py-10 sm:px-8 sm:py-14">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF7500] animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#0a0a0a]/50 uppercase">Rules &amp; Guidelines</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight uppercase text-[#0a0a0a] sm:text-7xl">
            Code of<br /><span className="text-[#FF7500]">Conduct</span>
          </h1>
        </div>

        {/* Rules list */}
        <div className="flex flex-col gap-3">
          {conductPoints.map((point, index) => (
            <div
              key={index}
              className="group flex gap-4 rounded-xl border border-[#0a0a0a]/8 bg-white/15 px-4 py-4 backdrop-blur-sm transition-all hover:bg-white/25 sm:px-5 sm:py-5"
            >
              {/* Index badge */}
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-black"
                style={{
                  background: "rgba(255,117,0,0.15)",
                  color: "#FF7500",
                  border: "1px solid rgba(255,117,0,0.3)",
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Text */}
              <p className="text-sm leading-relaxed text-[#0a0a0a]/75 sm:text-base">
                {index === 3 ? (
                  <>
                    All official changes and updates will be communicated through
                    the official channels of ISTE NITH (
                    <a
                      href={whatsappGroupUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[#0a0a0a] underline underline-offset-4 decoration-[#FF7500]/60 hover:decoration-[#FF7500] transition-colors"
                    >
                      Abhedya Participants WhatsApp Group
                    </a>
                    ). Participants are responsible for staying informed.
                  </>
                ) : (
                  point
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-8 font-mono text-[10px] tracking-widest text-[#0a0a0a]/30 uppercase text-center">
          Violation of any rule may result in immediate disqualification
        </p>
      </main>
    </div>
  )
}