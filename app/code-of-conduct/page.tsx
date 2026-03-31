import Navbar from "@/components/ui/navbar"

const whatsappGroupUrl =
  "https://chat.whatsapp.com/LIpjcMwREMy59h3ggY42DG?mode=gi_t"

const conductPoints = [
  "Uniform scoring applies to every stage of the challenge. However, if there is a tie then time is the final tiebreaker. ",
  "The first three contestants to solve the final riddle will secure the top positions, it offers an exclusive reserved prize pool for first years",
  "Any participant found engaging in unfair practices or misconduct will be immediately disqualified.",
  "All official changes and updates will be communicated through the official channels of ISTE NITH (Abhedya Participants Whatsapp Group). Participants are responsible for staying informed.",
  "In case of any dispute, the organizing committe will have the sole authority to make the final and binding decision.",
]

export default function CodeOfConductPage() {
  return (
    <div className="min-h-screen bg-[#88B7BD]">
      <Navbar dark />

      <main className="mx-auto w-full max-w-4xl px-6 py-10 text-[#0a0a0a] sm:px-8 sm:py-14">
        <h1 className="text-center text-3xl font-black tracking-tight underline decoration-2 underline-offset-8 sm:text-5xl">
          Code of Conduct
        </h1>

        <ol className="mt-8 list-decimal space-y-4 pl-6 text-base leading-relaxed sm:mt-10 sm:text-lg">
          {conductPoints.map((point, index) => (
            <li key={index}>
              {index === 3 ? (
                <>
                  All official changes and updates will be communicated through
                  the official channels of ISTE NITH (
                  <a
                    href={whatsappGroupUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold underline underline-offset-4"
                  >
                    Abhedya Participants Whatsapp Group
                  </a>
                  ). Participants are responsible for staying informed.
                </>
              ) : (
                point
              )}
            </li>
          ))}
        </ol>
      </main>
    </div>
  )
}
